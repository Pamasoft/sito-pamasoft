<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*, java.sql.Timestamp, java.util.regex.*, java.net.URLDecoder, java.net.*, java.io.*" %>
<%@ page import="com.mashape.unirest.http.*, com.mashape.unirest.http.exceptions.UnirestException, org.json.*" %>
<%
    /**
     * PAMASOFT - Newsletter Subscription Handler with MailBluster Integration
     * Version: 1.0
     * Date: October 2025
     * Company: Elleffe sas - P.IVA 05657500483
     *
     * Integrazione: MailBluster API con Double Opt-In
     * Documentazione: https://app.mailbluster.com/api-doc/leads
     */

    // ========================================
    // CONFIGURAZIONE
    // ========================================
    final String MAILBLUSTER_API_KEY = "8db66c67-345a-408b-a86a-75ffbae3aa79";
    final String MAILBLUSTER_API_URL = "https://api.mailbluster.com/api/leads";
    final int MAX_REQUESTS_PER_IP = 3; // Max iscrizioni per IP per sessione

    // ========================================
    // HEADERS & CORS - DEVE ESSERE LA PRIMA COSA!
    // ========================================

    // CORS (solo per pamasoft.com) - PRIMA DI TUTTO
    String origin = request.getHeader("Origin");
    if (origin != null && (origin.equals("https://pamasoft.com") || origin.equals("https://www.pamasoft.com") || origin.equals("http://localhost:8080"))) {
        response.setHeader("Access-Control-Allow-Origin", origin);
        response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Max-Age", "3600");
    }

    // Handle preflight OPTIONS request PRIMA DI TUTTO
    if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
        response.setStatus(HttpServletResponse.SC_OK);
        return;
    }

    // Altri headers di sicurezza
    response.setContentType("text/html; charset=UTF-8");
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    response.setHeader("Pragma", "no-cache");
    response.setDateHeader("Expires", 0);
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("X-Frame-Options", "SAMEORIGIN");
    response.setHeader("X-XSS-Protection", "1; mode=block");

    // Solo POST
    if (!request.getMethod().equals("POST")) {
        // Language detection per messaggio errore
        String langError = request.getParameter("lang");
        if (langError == null || langError.trim().isEmpty()) {
            String acceptLanguage = request.getHeader("Accept-Language");
            langError = (acceptLanguage != null && acceptLanguage.toLowerCase().startsWith("en")) ? "en" : "it";
        }
        String methodError = langError.equals("en") ? "Method not allowed." : "Metodo non consentito.";

        response.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
        out.println("<div class='alert-notification error'>");
        out.println("<i class='fas fa-exclamation-triangle'></i> " + methodError);
        out.println("</div>");
        return;
    }

    try {
        // ========================================
        // LANGUAGE DETECTION
        // ========================================
        String lang = request.getParameter("lang");
        if (lang == null || lang.trim().isEmpty()) {
            // Prova a dedurre dalla lingua del browser o default italiano
            String acceptLanguage = request.getHeader("Accept-Language");
            if (acceptLanguage != null && acceptLanguage.toLowerCase().startsWith("en")) {
                lang = "en";
            } else {
                lang = "it";
            }
        }

        // ========================================
        // TRANSLATIONS
        // ========================================
        java.util.Map<String, java.util.Map<String, String>> translations = new java.util.HashMap<>();

        // Italian translations
        java.util.Map<String, String> itTranslations = new java.util.HashMap<>();
        itTranslations.put("method_not_allowed", "Metodo non consentito.");
        itTranslations.put("too_many_requests_title", "Troppe richieste.");
        itTranslations.put("too_many_requests_msg", "Hai già effettuato diverse iscrizioni. Riprova più tardi.");
        itTranslations.put("email_required_title", "Email richiesta.");
        itTranslations.put("email_required_msg", "Inserisci un indirizzo email valido.");
        itTranslations.put("email_invalid_title", "Email non valida.");
        itTranslations.put("email_invalid_msg", "Inserisci un indirizzo email corretto.");
        itTranslations.put("email_temp_msg", "Gli indirizzi email temporanei non sono accettati.");
        itTranslations.put("privacy_required_title", "Privacy Policy richiesta.");
        itTranslations.put("privacy_required_msg", "Devi accettare la Privacy Policy per iscriverti.");
        itTranslations.put("success_title", "Iscrizione quasi completata!");
        itTranslations.put("success_msg", "Ti abbiamo inviato un'email di conferma a <strong>%s</strong>.<br>Clicca sul link nell'email per confermare la tua iscrizione alla newsletter.");
        itTranslations.put("already_subscribed_title", "Email già registrata.");
        itTranslations.put("already_subscribed_msg", "Questo indirizzo è già iscritto alla nostra newsletter.");
        itTranslations.put("validation_error_title", "Errore di validazione.");
        itTranslations.put("subscription_error_title", "Errore durante l'iscrizione.");
        itTranslations.put("subscription_error_msg", "Si è verificato un problema. Riprova più tardi.");
        itTranslations.put("connection_error_title", "Errore di connessione.");
        itTranslations.put("connection_error_msg", "Non è stato possibile contattare il servizio di newsletter. Riprova più tardi.");
        itTranslations.put("internal_error_title", "Errore interno.");
        itTranslations.put("internal_error_msg", "Si è verificato un errore durante l'elaborazione della risposta.");
        itTranslations.put("unexpected_error_title", "Errore imprevisto.");
        itTranslations.put("unexpected_error_msg", "Si è verificato un errore. Contattaci direttamente a <a href='mailto:info@pamasoft.com'>info@pamasoft.com</a>");
        translations.put("it", itTranslations);

        // English translations
        java.util.Map<String, String> enTranslations = new java.util.HashMap<>();
        enTranslations.put("method_not_allowed", "Method not allowed.");
        enTranslations.put("too_many_requests_title", "Too many requests.");
        enTranslations.put("too_many_requests_msg", "You have already made several subscriptions. Please try again later.");
        enTranslations.put("email_required_title", "Email required.");
        enTranslations.put("email_required_msg", "Enter a valid email address.");
        enTranslations.put("email_invalid_title", "Invalid email.");
        enTranslations.put("email_invalid_msg", "Enter a correct email address.");
        enTranslations.put("email_temp_msg", "Temporary email addresses are not accepted.");
        enTranslations.put("privacy_required_title", "Privacy Policy required.");
        enTranslations.put("privacy_required_msg", "You must accept the Privacy Policy to subscribe.");
        enTranslations.put("success_title", "Subscription almost complete!");
        enTranslations.put("success_msg", "We have sent you a confirmation email to <strong>%s</strong>.<br>Click the link in the email to confirm your newsletter subscription.");
        enTranslations.put("already_subscribed_title", "Email already registered.");
        enTranslations.put("already_subscribed_msg", "This address is already subscribed to our newsletter.");
        enTranslations.put("validation_error_title", "Validation error.");
        enTranslations.put("subscription_error_title", "Error during subscription.");
        enTranslations.put("subscription_error_msg", "A problem occurred. Please try again later.");
        enTranslations.put("connection_error_title", "Connection error.");
        enTranslations.put("connection_error_msg", "Unable to contact the newsletter service. Please try again later.");
        enTranslations.put("internal_error_title", "Internal error.");
        enTranslations.put("internal_error_msg", "An error occurred while processing the response.");
        enTranslations.put("unexpected_error_title", "Unexpected error.");
        enTranslations.put("unexpected_error_msg", "An error occurred. Contact us directly at <a href='mailto:info@pamasoft.com'>info@pamasoft.com</a>");
        translations.put("en", enTranslations);

        // Get current language translations (default to Italian)
        java.util.Map<String, String> t = translations.get(lang);
        if (t == null) {
            t = translations.get("it");
        }

        // Helper function to get translation
        Map<String, String> finalT = t;
        java.util.function.Function<String, String> tr = (key) -> {
            String value = finalT.get(key);
            return value != null ? value : key;
        };

        // ========================================
        // PROTEZIONE 1: RATE LIMITING PER IP
        // ========================================
        String clientIP = request.getHeader("X-Forwarded-For");
        if (clientIP == null || clientIP.isEmpty()) {
            clientIP = request.getRemoteAddr();
        } else {
            clientIP = clientIP.split(",")[0].trim();
        }

        String sessionKey = "newsletter_requests_" + clientIP;
        Integer requestCount = (Integer) session.getAttribute(sessionKey);
        Long lastRequestTime = (Long) session.getAttribute(sessionKey + "_time");

        if (requestCount == null) {
            requestCount = 0;
        }

        // Reset counter dopo 1 ora
        long currentTime = System.currentTimeMillis();
        if (lastRequestTime != null && (currentTime - lastRequestTime > 3600000)) {
            requestCount = 0;
        }

        if (requestCount >= MAX_REQUESTS_PER_IP) {
            response.setStatus(429); // HTTP 429 Too Many Requests
            out.println("<div class='alert-notification error'>");
            out.println("<i class='fas fa-exclamation-triangle'></i> ");
            out.println("<strong>" + tr.apply("too_many_requests_title") + "</strong><br>");
            out.println(tr.apply("too_many_requests_msg"));
            out.println("</div>");
            return;
        }

        // Incrementa contatore
        requestCount++;
        session.setAttribute(sessionKey, requestCount);
        session.setAttribute(sessionKey + "_time", currentTime);

        // ========================================
        // PROTEZIONE 2: HONEYPOT
        // ========================================
        String honeypot = request.getParameter("website");
        if (honeypot != null && !honeypot.trim().isEmpty()) {
            // Bot detected - fail silently (usa traduzioni)
            String langHoneypot = request.getParameter("lang");
            if (langHoneypot == null || langHoneypot.trim().isEmpty()) {
                String acceptLanguage = request.getHeader("Accept-Language");
                langHoneypot = (acceptLanguage != null && acceptLanguage.toLowerCase().startsWith("en")) ? "en" : "it";
            }
            String honeypotSuccess = langHoneypot.equals("en")
                    ? "<strong>Thank you!</strong> Check your email to confirm your subscription."
                    : "<strong>Grazie!</strong> Controlla la tua email per confermare l'iscrizione.";

            out.println("<div class='alert-notification success'>");
            out.println("<i class='fas fa-check-circle'></i> ");
            out.println(honeypotSuccess);
            out.println("</div>");
            return;
        }

        // ========================================
        // RECUPERA E VALIDA EMAIL
        // ========================================
        String email = request.getParameter("email");
        String privacyAccept = request.getParameter("privacy_accept");

        // Validazione email
        if (email == null || email.trim().isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("<div class='alert-notification error'>");
            out.println("<i class='fas fa-exclamation-triangle'></i> ");
            out.println("<strong>" + tr.apply("email_required_title") + "</strong><br>" + tr.apply("email_required_msg"));
            out.println("</div>");
            return;
        }

        email = email.trim().toLowerCase();

        // Regex validazione email
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        if (!email.matches(emailRegex)) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("<div class='alert-notification error'>");
            out.println("<i class='fas fa-exclamation-triangle'></i> ");
            out.println("<strong>" + tr.apply("email_invalid_title") + "</strong><br>" + tr.apply("email_invalid_msg"));
            out.println("</div>");
            return;
        }

        // Validazione privacy
        if (privacyAccept == null || !privacyAccept.equals("on")) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("<div class='alert-notification error'>");
            out.println("<i class='fas fa-exclamation-triangle'></i> ");
            out.println("<strong>" + tr.apply("privacy_required_title") + "</strong><br>" + tr.apply("privacy_required_msg"));
            out.println("</div>");
            return;
        }

        // ========================================
        // PROTEZIONE 3: DOMINI EMAIL SOSPETTI
        // ========================================
        String[] suspiciousDomains = {
                "tempmail", "throwaway", "guerrillamail", "10minutemail",
                "mailinator", "trash-mail", "fakeinbox", "temp-mail"
        };

        for (String domain : suspiciousDomains) {
            if (email.contains(domain)) {
                out.println("<div class='alert-notification error'>");
                out.println("<i class='fas fa-exclamation-triangle'></i> ");
                out.println("<strong>" + tr.apply("email_invalid_title") + "</strong><br>" + tr.apply("email_temp_msg"));
                out.println("</div>");
                return;
            }
        }

        // ========================================
        // INTEGRAZIONE MAILBLUSTER API
        // ========================================

        System.out.println("=== MAILBLUSTER API - Newsletter Subscription ===");
        System.out.println("Email: " + email);
        System.out.println("IP Address: " + clientIP);
        System.out.println("Timestamp: " + new Timestamp(System.currentTimeMillis()));

        // Prepara payload JSON per MailBluster
        JSONObject payload = new JSONObject();
        payload.put("email", email);
        payload.put("ipAddress", clientIP);
        payload.put("subscribed", true);
        payload.put("doubleOptIn", true); // IMPORTANTE: Abilita Double Opt-In

        // Aggiungi tags
        JSONArray tags = new JSONArray();
        tags.put("website");
        tags.put("footer-newsletter");
        payload.put("tags", tags);

        System.out.println("Payload: " + payload.toString());

        // Chiamata API con Unirest (con fallback a HttpURLConnection)
        HttpResponse<String> apiResponse = null;
        int statusCode = 0;
        String responseBody = null;

        try {
            System.out.println("=== MailBluster API Request ===");
            System.out.println("URL: " + MAILBLUSTER_API_URL);
            System.out.println("Method: POST");
            System.out.println("Headers: Authorization=" + MAILBLUSTER_API_KEY.substring(0, Math.min(10, MAILBLUSTER_API_KEY.length())) + "...");
            System.out.println("Payload: " + payload.toString());

            // Prova prima con Unirest
            try {
                apiResponse = Unirest.post(MAILBLUSTER_API_URL)
                        .header("Authorization", MAILBLUSTER_API_KEY)
                        .header("Content-Type", "application/json")
                        .body(payload.toString())
                        .asString();

                statusCode = apiResponse.getStatus();
                responseBody = apiResponse.getBody();

            } catch (NoClassDefFoundError e) {
                // Unirest non disponibile, usa HttpURLConnection nativo
                System.out.println("⚠ Unirest non disponibile, uso HttpURLConnection nativo");
                System.err.println("Unirest error: " + e.getMessage());

                java.net.URL url = new java.net.URL(MAILBLUSTER_API_URL);
                java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Authorization", MAILBLUSTER_API_KEY);
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);
                conn.setConnectTimeout(10000); // 10 secondi
                conn.setReadTimeout(10000); // 10 secondi

                // Invia payload
                java.io.OutputStream os = conn.getOutputStream();
                byte[] input = payload.toString().getBytes("UTF-8");
                os.write(input, 0, input.length);
                os.flush();
                os.close();

                statusCode = conn.getResponseCode();

                // Leggi risposta
                java.io.BufferedReader br;
                if (statusCode >= 200 && statusCode < 300) {
                    br = new java.io.BufferedReader(new java.io.InputStreamReader(conn.getInputStream(), "UTF-8"));
                } else {
                    br = new java.io.BufferedReader(new java.io.InputStreamReader(conn.getErrorStream(), "UTF-8"));
                }

                StringBuilder mailblusterResponse = new StringBuilder();
                String responseLine;
                while ((responseLine = br.readLine()) != null) {
                    mailblusterResponse.append(responseLine.trim());
                }
                br.close();
                responseBody = mailblusterResponse.toString();
            }

            System.out.println("=== MailBluster Response ===");
            System.out.println("Status Code: " + statusCode);
            System.out.println("Response Body: " + (responseBody != null ? responseBody : "NULL"));

            // Verifica che la risposta non sia vuota
            if (responseBody == null || responseBody.trim().isEmpty()) {
                throw new Exception("Empty response from MailBluster API");
            }

            // Parse risposta
            JSONObject jsonResponse = null;
            try {
                jsonResponse = new JSONObject(responseBody);
            } catch (JSONException je) {
                System.err.println("✗ Errore parsing JSON risposta: " + je.getMessage());
                System.err.println("Response body: " + responseBody);
                throw new Exception("Invalid JSON response from MailBluster: " + je.getMessage());
            }

            // Verifica successo (200 o 201)
            if (statusCode == 200 || statusCode == 201) {
                // Successo!
                System.out.println("✓ Lead creato con successo su MailBluster");
                System.out.println("Lead ID: " + jsonResponse.optString("id", "N/A"));

                String successMsg = String.format(tr.apply("success_msg"), email);
                out.println("<div class='alert-notification success'>");
                out.println("<i class='fas fa-check-circle'></i> ");
                out.println("<strong>" + tr.apply("success_title") + "</strong><br>");
                out.println(successMsg);
                out.println("</div>");

            } else if (statusCode == 409) {
                // Email già esistente
                System.out.println("⚠ Email già registrata");

                out.println("<div class='alert-notification warning'>");
                out.println("<i class='fas fa-info-circle'></i> ");
                out.println("<strong>" + tr.apply("already_subscribed_title") + "</strong><br>");
                out.println(tr.apply("already_subscribed_msg"));
                out.println("</div>");

            } else if (statusCode == 422) {
                // Validazione fallita
                String errorMessage = jsonResponse.optString("message", tr.apply("validation_error_title"));
                System.out.println("✗ Validazione fallita: " + errorMessage);

                out.println("<div class='alert-notification error'>");
                out.println("<i class='fas fa-exclamation-triangle'></i> ");
                out.println("<strong>" + tr.apply("validation_error_title") + "</strong><br>" + errorMessage);
                out.println("</div>");

            } else {
                // Altro errore - log dettagliato
                String errorMessage = "";
                if (jsonResponse != null) {
                    errorMessage = jsonResponse.optString("message", "");
                }
                System.err.println("✗✗✗ ERRORE API MAILBLUSTER - Status Code Non Gestito ✗✗✗");
                System.err.println("Status Code: " + statusCode);
                System.err.println("Status Code attesi: 200, 201, 409, 422");
                System.err.println("Error Message: " + errorMessage);
                System.err.println("Response Body: " + responseBody);
                System.err.println("Email: " + email);
                System.err.println("IP: " + clientIP);
                System.err.println("JSON Response null? " + (jsonResponse == null));
                System.err.println("✗✗✗ FINE ERRORE API ✗✗✗");

                out.println("<div class='alert-notification error'>");
                out.println("<i class='fas fa-exclamation-triangle'></i> ");
                out.println("<strong>" + tr.apply("subscription_error_title") + "</strong><br>");
                out.println(tr.apply("subscription_error_msg"));
                if (!errorMessage.isEmpty()) {
                    out.println("<br><small>Dettaglio: " + errorMessage + "</small>");
                }
                out.println("</div>");
            }

        } catch (UnirestException e) {
            // Errore di connessione
            System.err.println("✗ Errore connessione MailBluster API: " + e.getMessage());
            System.err.println("Exception type: " + e.getClass().getName());
            if (e.getCause() != null) {
                System.err.println("Caused by: " + e.getCause().getMessage());
            }
            e.printStackTrace();

            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println("<div class='alert-notification error'>");
            out.println("<i class='fas fa-exclamation-triangle'></i> ");
            out.println("<strong>" + tr.apply("connection_error_title") + "</strong><br>");
            out.println(tr.apply("connection_error_msg"));
            out.println("</div>");

        } catch (JSONException e) {
            // Errore parsing JSON
            System.err.println("✗ Errore parsing risposta MailBluster: " + e.getMessage());
            System.err.println("Response was: " + (apiResponse != null ? apiResponse.getBody() : "NULL"));
            e.printStackTrace();

            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println("<div class='alert-notification error'>");
            out.println("<i class='fas fa-exclamation-triangle'></i> ");
            out.println("<strong>" + tr.apply("internal_error_title") + "</strong><br>");
            out.println(tr.apply("internal_error_msg"));
            out.println("</div>");

        } catch (Exception e) {
            // Altri errori (inclusi errori di parsing JSON custom)
            System.err.println("✗ Errore generico MailBluster API: " + e.getMessage());
            System.err.println("Exception type: " + e.getClass().getName());
            if (e.getCause() != null) {
                System.err.println("Caused by: " + e.getCause().getMessage());
            }
            e.printStackTrace();

            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println("<div class='alert-notification error'>");
            out.println("<i class='fas fa-exclamation-triangle'></i> ");
            out.println("<strong>" + tr.apply("subscription_error_title") + "</strong><br>");
            out.println(tr.apply("subscription_error_msg"));
            out.println("</div>");
        }

        System.out.println("=== End MailBluster API Call ===\n");

    } catch (Exception e) {
        // Errore generico - log dettagliato
        System.err.println("✗✗✗ ERRORE GENERICO NEWSLETTER SUBSCRIPTION ✗✗✗");
        System.err.println("Exception Type: " + e.getClass().getName());
        System.err.println("Exception Message: " + e.getMessage());
        System.err.println("Exception Cause: " + (e.getCause() != null ? e.getCause().getMessage() : "N/A"));
        System.err.println("Stack Trace:");
        e.printStackTrace();
        System.err.println("Request Details:");
        System.err.println("  Method: " + request.getMethod());
        System.err.println("  IP: " + request.getRemoteAddr());
        System.err.println("  User-Agent: " + request.getHeader("User-Agent"));
        System.err.println("  Referer: " + request.getHeader("Referer"));
        System.err.println("  Email param: " + request.getParameter("email"));
        System.err.println("  Lang param: " + request.getParameter("lang"));
        System.err.println("✗✗✗ FINE ERRORE ✗✗✗");

        // Prova a recuperare le traduzioni se disponibili
        String langError = request.getParameter("lang");
        if (langError == null || langError.trim().isEmpty()) {
            String acceptLanguage = request.getHeader("Accept-Language");
            langError = (acceptLanguage != null && acceptLanguage.toLowerCase().startsWith("en")) ? "en" : "it";
        }

        java.util.Map<String, java.util.Map<String, String>> errorTranslations = new java.util.HashMap<>();
        java.util.Map<String, String> itError = new java.util.HashMap<>();
        itError.put("title", "Errore imprevisto.");
        itError.put("msg", "Si è verificato un errore. Contattaci direttamente a <a href='mailto:info@pamasoft.com'>info@pamasoft.com</a>");
        errorTranslations.put("it", itError);
        java.util.Map<String, String> enError = new java.util.HashMap<>();
        enError.put("title", "Unexpected error.");
        enError.put("msg", "An error occurred. Contact us directly at <a href='mailto:info@pamasoft.com'>info@pamasoft.com</a>");
        errorTranslations.put("en", enError);

        java.util.Map<String, String> errorT = errorTranslations.get(langError);
        if (errorT == null) errorT = errorTranslations.get("it");

        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        out.println("<div class='alert-notification error'>");
        out.println("<i class='fas fa-exclamation-triangle'></i> ");
        out.println("<strong>" + errorT.get("title") + "</strong><br>");
        out.println(errorT.get("msg"));
        out.println("</div>");
    }
%>

