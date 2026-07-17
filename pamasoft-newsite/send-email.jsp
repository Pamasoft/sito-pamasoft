<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*, java.sql.Timestamp, java.util.regex.*, java.net.URLDecoder" %>
<%@ page import="mailAWS.SendMail, mailAWS.EmailCredentialPamasoftErp" %>
<%
    /**
     * PAMASOFT - Contact Form Handler with Advanced Bot Protection
     * Version: 1.0
     * Date: October 2025
     * Company: Elleffe sas - P.IVA 05657500483
     */

    // ========================================
    // CONFIGURAZIONE
    // ========================================
    final String TO_EMAIL = "info@pamasoft.com";
    final int MAX_REQUESTS_PER_IP = 3; // Max richieste per IP per sessione (ridotto per maggiore sicurezza)
    final long MIN_FORM_FILL_TIME = 5000; // 5 secondi - tempo minimo per compilare il form (aumentato)
    final long MAX_FORM_FILL_TIME = 3600000; // 1 ora - tempo massimo
    final int MAX_MESSAGE_LENGTH = 5000;
    final int MIN_MESSAGE_LENGTH = 20; // Lunghezza minima messaggio (anti-spam)
    
    // reCAPTCHA v3 (opzionale - configurare se si vuole usare)
    final String RECAPTCHA_SECRET_KEY = "YOUR_RECAPTCHA_SECRET_KEY"; // Da configurare
    final boolean RECAPTCHA_ENABLED = !RECAPTCHA_SECRET_KEY.equals("YOUR_RECAPTCHA_SECRET_KEY");
    
    // ========================================
    // HEADERS & CORS - DEVE ESSERE LA PRIMA COSA!
    // ========================================
    
    // CORS (solo per pamasoft.com) - PRIMA DI TUTTO
    String origin = request.getHeader("Origin");
    if (origin != null && (origin.equals("https://pamasoft.com") || origin.equals("https://www.pamasoft.com") || origin.equals("http://localhost:8080"))) {
        response.setHeader("Access-Control-Allow-Origin", origin);
        response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Requested-With, HX-Request, HX-Target, HX-Current-URL");
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
        response.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
        out.println("<div class='alert-notification error'>");
        out.println("<i class='fas fa-exclamation-triangle'></i> Metodo non consentito.");
        out.println("</div>");
        return;
    }

    try {
        // ========================================
        // PROTEZIONE 1: RATE LIMITING PER IP
        // ========================================
        String clientIP = request.getHeader("X-Forwarded-For");
        if (clientIP == null || clientIP.isEmpty()) {
            clientIP = request.getRemoteAddr();
        } else {
            clientIP = clientIP.split(",")[0].trim();
        }
        
        String sessionKey = "form_requests_" + clientIP;
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
            response.setStatus(429); // Too Many Requests
            out.println("<div class='alert-notification error'>");
            out.println("<i class='fas fa-exclamation-circle'></i> ");
            out.println("<strong>Troppi tentativi.</strong><br>");
            out.println("Per favore, riprova tra 1 ora o contattaci via email a <a href='mailto:info@pamasoft.com'>info@pamasoft.com</a>.");
            out.println("</div>");
            return;
        }
        
        // ========================================
        // PROTEZIONE 2: REFERRER CHECK
        // ========================================
        String referer = request.getHeader("Referer");
        if (referer == null || referer.isEmpty()) {
            // Alcuni browser legittimi non inviano referer, ma è sospetto
            System.out.println("[SECURITY] Missing referer from IP: " + clientIP);
        } else {
            // Verifica che il referer sia da pamasoft.com
            if (!referer.contains("pamasoft.com") && !referer.contains("localhost")) {
                System.out.println("[SECURITY] Invalid referer from IP: " + clientIP + " - Referer: " + referer);
                out.println("<div class='alert-notification error'>");
                out.println("<i class='fas fa-exclamation-circle'></i> Richiesta non valida.");
                out.println("</div>");
                return;
            }
        }
        
        // ========================================
        // PROTEZIONE 3: USER-AGENT CHECK
        // ========================================
        String userAgent = request.getHeader("User-Agent");
        if (userAgent == null || userAgent.trim().isEmpty() || userAgent.length() < 10) {
            System.out.println("[SECURITY] Missing or suspicious User-Agent from IP: " + clientIP);
            out.println("<div class='alert-notification error'>");
            out.println("<i class='fas fa-exclamation-circle'></i> Richiesta non valida.");
            out.println("</div>");
            return;
        }
        
        // Blocca user-agent sospetti comuni
        String[] suspiciousUserAgents = {"curl", "wget", "python-requests", "scrapy", "bot", "crawler", "spider"};
        String userAgentLower = userAgent.toLowerCase();
        for (String suspicious : suspiciousUserAgents) {
            if (userAgentLower.contains(suspicious) && !userAgentLower.contains("googlebot") && !userAgentLower.contains("bingbot")) {
                System.out.println("[SECURITY] Suspicious User-Agent from IP: " + clientIP + " - UA: " + userAgent);
                out.println("<div class='alert-notification error'>");
                out.println("<i class='fas fa-exclamation-circle'></i> Richiesta non valida.");
                out.println("</div>");
                return;
            }
        }
        
        // ========================================
        // PROTEZIONE 4: reCAPTCHA v3 VERIFICATION
        // ========================================
        String recaptchaToken = request.getParameter("recaptcha_token");
        if (RECAPTCHA_ENABLED && recaptchaToken != null && !recaptchaToken.isEmpty()) {
            try {
                // Verifica token con Google reCAPTCHA API
                java.net.URL url = new java.net.URL("https://www.google.com/recaptcha/api/siteverify");
                java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setDoOutput(true);
                
                String postData = "secret=" + java.net.URLEncoder.encode(RECAPTCHA_SECRET_KEY, "UTF-8") +
                                 "&response=" + java.net.URLEncoder.encode(recaptchaToken, "UTF-8") +
                                 "&remoteip=" + java.net.URLEncoder.encode(clientIP, "UTF-8");
                
                java.io.DataOutputStream wr = new java.io.DataOutputStream(conn.getOutputStream());
                wr.writeBytes(postData);
                wr.flush();
                wr.close();
                
                java.io.BufferedReader in = new java.io.BufferedReader(new java.io.InputStreamReader(conn.getInputStream()));
                String inputLine;
                StringBuilder recaptchaResponse = new StringBuilder();
                while ((inputLine = in.readLine()) != null) {
                    recaptchaResponse.append(inputLine);
                }
                in.close();
                
                // Parse JSON response
                String jsonResponse = recaptchaResponse.toString();
                boolean success = jsonResponse.contains("\"success\":true");
                double score = 0.5; // Default score
                
                // Estrai score se presente
                java.util.regex.Pattern scorePattern = java.util.regex.Pattern.compile("\"score\":([0-9.]+)");
                java.util.regex.Matcher scoreMatcher = scorePattern.matcher(jsonResponse);
                if (scoreMatcher.find()) {
                    score = Double.parseDouble(scoreMatcher.group(1));
                }
                
                // reCAPTCHA v3 score < 0.5 = probabilmente bot
                if (!success || score < 0.5) {
                    System.out.println("[SECURITY] reCAPTCHA failed from IP: " + clientIP + " - Score: " + score);
                    out.println("<div class='alert-notification error'>");
                    out.println("<i class='fas fa-exclamation-circle'></i> ");
                    out.println("Verifica di sicurezza fallita. Riprova.");
                    out.println("</div>");
                    return;
                }
            } catch (Exception e) {
                System.err.println("[ERROR] reCAPTCHA verification error: " + e.getMessage());
                // Se reCAPTCHA fallisce, continua comunque (non bloccare utenti legittimi)
            }
        }
        
        // ========================================
        // PROTEZIONE 5: HONEYPOT (campo nascosto)
        // ========================================
        String honeypot = request.getParameter("website"); // Campo nascosto per bot
        if (honeypot != null && !honeypot.trim().isEmpty()) {
            // Bot detected - log e blocca silenziosamente
            System.out.println("[SECURITY] Bot detected from IP: " + clientIP + " - Honeypot filled: " + honeypot);
            
            // Finta risposta di successo per confondere il bot
            out.println("<div class='alert-notification success'>");
            out.println("<i class='fas fa-check-circle'></i> Messaggio inviato con successo!");
            out.println("</div>");
            return;
        }
        
        // ========================================
        // PROTEZIONE 6: TIMESTAMP CHECK
        // ========================================
        String formTimestamp = request.getParameter("form_timestamp");
        if (formTimestamp != null && !formTimestamp.isEmpty()) {
            try {
                long timestamp = Long.parseLong(formTimestamp);
                long timeDiff = currentTime - timestamp;
                
                // Form compilato troppo velocemente (bot)
                if (timeDiff < MIN_FORM_FILL_TIME) {
                    System.out.println("[SECURITY] Bot detected from IP: " + clientIP + " - Form filled too fast: " + timeDiff + "ms");
                    out.println("<div class='alert-notification error'>");
                    out.println("<i class='fas fa-exclamation-circle'></i> Per favore, compila il form con più attenzione.");
                    out.println("</div>");
                    return;
                }
                
                // Form aperto troppo a lungo (possibile replay attack)
                if (timeDiff > MAX_FORM_FILL_TIME) {
                    System.out.println("[SECURITY] Expired form from IP: " + clientIP + " - Time diff: " + timeDiff + "ms");
                    out.println("<div class='alert-notification error'>");
                    out.println("<i class='fas fa-exclamation-circle'></i> Il form è scaduto. Per favore, ricarica la pagina.");
                    out.println("</div>");
                    return;
                }
            } catch (NumberFormatException e) {
                System.out.println("[SECURITY] Invalid timestamp from IP: " + clientIP);
                out.println("<div class='alert-notification error'>");
                out.println("<i class='fas fa-exclamation-circle'></i> Errore di validazione. Ricarica la pagina.");
                out.println("</div>");
                return;
            }
        }
        
        // ========================================
        // RECUPERA E SANITIZZA I PARAMETRI
        // ========================================
        String firstName = sanitizeInput(request.getParameter("first_name"));
        String lastName = sanitizeInput(request.getParameter("last_name"));
        String email = sanitizeInput(request.getParameter("email"));
        String company = sanitizeInput(request.getParameter("company"));
        String phonePrefix = sanitizeInput(request.getParameter("phone_prefix"));
        String phoneNumber = sanitizeInput(request.getParameter("phone_number"));
        String service = sanitizeInput(request.getParameter("service"));
        String message = sanitizeInput(request.getParameter("message"));
        String privacyAccept = request.getParameter("privacy_accept");
        String newsletterAccept = request.getParameter("newsletter_accept");
        
        // ========================================
        // VALIDAZIONE CAMPI OBBLIGATORI
        // ========================================
        if (firstName == null || firstName.trim().isEmpty() ||
            lastName == null || lastName.trim().isEmpty() ||
            email == null || email.trim().isEmpty() ||
            message == null || message.trim().isEmpty() ||
            privacyAccept == null) {
            
            out.println("<div class='alert-notification error'>");
            out.println("<i class='fas fa-exclamation-circle'></i> ");
            out.println("Per favore, compila tutti i campi obbligatori.");
            out.println("</div>");
            return;
        }
        
        // ========================================
        // VALIDAZIONE EMAIL (regex avanzata)
        // ========================================
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        Pattern emailPattern = Pattern.compile(emailRegex);
        if (!emailPattern.matcher(email).matches()) {
            out.println("<div class='alert-notification error'>");
            out.println("<i class='fas fa-exclamation-circle'></i> ");
            out.println("Indirizzo email non valido.");
            out.println("</div>");
            return;
        }
        
        // Blocca email temporanee/disposable (lista estesa)
        String[] disposableDomains = {
            "tempmail.com", "guerrillamail.com", "10minutemail.com", "mailinator.com", "trashmail.com",
            "throwaway.email", "temp-mail.org", "getnada.com", "mohmal.com", "yopmail.com",
            "sharklasers.com", "grr.la", "guerrillamailblock.com", "pokemail.net", "spam4.me",
            "bccto.me", "chitthi.in", "dispostable.com", "fakeinbox.com", "maildrop.cc",
            "mintemail.com", "mytrashmail.com", "tempail.com", "tempinbox.com", "tempmailo.com"
        };
        String emailDomain = email.substring(email.indexOf("@") + 1).toLowerCase();
        for (String disposable : disposableDomains) {
            if (emailDomain.equals(disposable) || emailDomain.endsWith("." + disposable)) {
                System.out.println("[SECURITY] Disposable email detected from IP: " + clientIP + " - Email: " + email);
                out.println("<div class='alert-notification error'>");
                out.println("<i class='fas fa-exclamation-circle'></i> ");
                out.println("Per favore, utilizza un indirizzo email valido.");
                out.println("</div>");
                return;
            }
        }
        
        // Controlla pattern sospetti nell'email (numeri consecutivi, caratteri ripetuti)
        String emailLocal = email.substring(0, email.indexOf("@"));
        if (emailLocal.matches(".*(\\d{6,}).*") || emailLocal.matches(".*([a-z])\\1{4,}.*")) {
            System.out.println("[SECURITY] Suspicious email pattern from IP: " + clientIP + " - Email: " + email);
            out.println("<div class='alert-notification error'>");
            out.println("<i class='fas fa-exclamation-circle'></i> ");
            out.println("Per favore, utilizza un indirizzo email valido.");
            out.println("</div>");
            return;
        }
        
        // ========================================
        // VALIDAZIONE LUNGHEZZA MESSAGGIO
        // ========================================
        if (message.length() < MIN_MESSAGE_LENGTH) {
            out.println("<div class='alert-notification error'>");
            out.println("<i class='fas fa-exclamation-circle'></i> ");
            out.println("Il messaggio è troppo corto (min " + MIN_MESSAGE_LENGTH + " caratteri).");
            out.println("</div>");
            return;
        }
        if (message.length() > MAX_MESSAGE_LENGTH) {
            out.println("<div class='alert-notification error'>");
            out.println("<i class='fas fa-exclamation-circle'></i> ");
            out.println("Il messaggio è troppo lungo (max " + MAX_MESSAGE_LENGTH + " caratteri).");
            out.println("</div>");
            return;
        }
        
        // Controlla pattern ripetitivi nel messaggio (spam comune)
        if (message.matches(".*(.)\\1{10,}.*") || message.matches(".*([A-Z])\\1{5,}.*")) {
            System.out.println("[SECURITY] Repetitive pattern in message from IP: " + clientIP);
            out.println("<div class='alert-notification error'>");
            out.println("<i class='fas fa-exclamation-circle'></i> ");
            out.println("Il messaggio contiene pattern non validi.");
            out.println("</div>");
            return;
        }
        
        // ========================================
        // VALIDAZIONE NOME E COGNOME (no numeri o caratteri speciali sospetti)
        // ========================================
        String nameRegex = "^[a-zA-ZÀ-ÿ\\s'-]{2,50}$";
        Pattern namePattern = Pattern.compile(nameRegex);
        if (!namePattern.matcher(firstName).matches() || !namePattern.matcher(lastName).matches()) {
            out.println("<div class='alert-notification error'>");
            out.println("<i class='fas fa-exclamation-circle'></i> ");
            out.println("Nome o cognome non validi.");
            out.println("</div>");
            return;
        }
        
        // ========================================
        // PROTEZIONE 7: CONTROLLO CONTENUTI SPAM (ESTESO)
        // ========================================
        String[] spamKeywords = {
            "viagra", "cialis", "casino", "lottery", "bitcoin", "crypto", "investment opportunity",
            "click here", "buy now", "limited offer", "act now", "urgent", "guaranteed",
            "make money", "work from home", "get rich", "free money", "winner", "prize",
            "congratulations", "you won", "claim now", "click below", "visit our website",
            "seo services", "backlinks", "increase traffic", "social media followers",
            "weight loss", "miracle", "guarantee", "no risk", "100% free"
        };
        String messageLower = message.toLowerCase();
        String emailLower = email.toLowerCase();
        String firstNameLower = firstName.toLowerCase();
        String lastNameLower = lastName.toLowerCase();
        
        // Controlla nel messaggio
        for (String spam : spamKeywords) {
            if (messageLower.contains(spam)) {
                System.out.println("[SECURITY] Spam keyword detected from IP: " + clientIP + " - Keyword: " + spam);
                out.println("<div class='alert-notification error'>");
                out.println("<i class='fas fa-exclamation-circle'></i> ");
                out.println("Il messaggio contiene contenuti non consentiti.");
                out.println("</div>");
                return;
            }
        }
        
        // Controlla URL sospetti nel messaggio
        if (message.matches(".*https?://[^\\s]+.*") && !message.contains("pamasoft.com") && !message.contains("calendly.com")) {
            System.out.println("[SECURITY] Suspicious URL in message from IP: " + clientIP);
            out.println("<div class='alert-notification error'>");
            out.println("<i class='fas fa-exclamation-circle'></i> ");
            out.println("Il messaggio contiene link non consentiti.");
            out.println("</div>");
            return;
        }
        
        // Controlla pattern comuni di spam (troppo generico)
        if (messageLower.length() < 50 && (messageLower.contains("hello") || messageLower.contains("hi") || messageLower.contains("ciao")) && 
            (messageLower.contains("interested") || messageLower.contains("interessato") || messageLower.contains("contact"))) {
            // Messaggio troppo generico e corto = possibile spam
            System.out.println("[SECURITY] Generic spam message from IP: " + clientIP);
        }
        
        // ========================================
        // COSTRUZIONE EMAIL HTML
        // ========================================
        StringBuilder emailBody = new StringBuilder();
        emailBody.append("<!DOCTYPE html>");
        emailBody.append("<html lang='it'>");
        emailBody.append("<head><meta charset='UTF-8'><style>");
        emailBody.append("body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }");
        emailBody.append(".container { max-width: 600px; margin: 0 auto; background: #ffffff; }");
        emailBody.append(".header { background: linear-gradient(135deg, #1351D8 0%, #0056b3 100%); color: white; padding: 30px; text-align: center; }");
        emailBody.append(".header h1 { margin: 0; font-size: 24px; }");
        emailBody.append(".content { padding: 30px; background: #f8f9fa; }");
        emailBody.append(".field { background: white; padding: 15px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid #1351D8; }");
        emailBody.append(".field strong { color: #1351D8; display: block; margin-bottom: 5px; }");
        emailBody.append(".message-box { background: white; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6; margin: 20px 0; }");
        emailBody.append(".footer { background: #343a40; color: #ffffff; padding: 20px; text-align: center; font-size: 12px; }");
        emailBody.append(".footer a { color: #1351D8; text-decoration: none; }");
        emailBody.append(".badge { display: inline-block; padding: 4px 8px; background: #1351D8; color: white; border-radius: 4px; font-size: 11px; }");
        emailBody.append("</style></head>");
        emailBody.append("<body>");
        emailBody.append("<div class='container'>");
        
        // Header
        emailBody.append("<div class='header'>");
        emailBody.append("<h1>📧 Nuova Richiesta di Contatto</h1>");
        emailBody.append("<p style='margin: 10px 0 0 0; opacity: 0.9;'>Pamasoft.com</p>");
        emailBody.append("</div>");
        
        // Content
        emailBody.append("<div class='content'>");
        
        // Dati contatto
        emailBody.append("<div class='field'>");
        emailBody.append("<strong>👤 Nome Completo</strong>");
        emailBody.append(escapeHtml(firstName)).append(" ").append(escapeHtml(lastName));
        emailBody.append("</div>");
        
        emailBody.append("<div class='field'>");
        emailBody.append("<strong>📧 Email</strong>");
        emailBody.append("<a href='mailto:").append(escapeHtml(email)).append("'>").append(escapeHtml(email)).append("</a>");
        emailBody.append("</div>");
        
        // Azienda (opzionale)
        if (company != null && !company.trim().isEmpty()) {
            emailBody.append("<div class='field'>");
            emailBody.append("<strong>🏢 Azienda</strong>");
            emailBody.append(escapeHtml(company));
            emailBody.append("</div>");
        }
        
        // Telefono (opzionale)
        if (phoneNumber != null && !phoneNumber.trim().isEmpty()) {
            emailBody.append("<div class='field'>");
            emailBody.append("<strong>📱 Telefono</strong>");
            String fullPhone = (phonePrefix != null ? escapeHtml(phonePrefix) + " " : "") + escapeHtml(phoneNumber);
            emailBody.append("<a href='tel:").append(fullPhone.replaceAll("\\s", "")).append("'>").append(fullPhone).append("</a>");
            emailBody.append("</div>");
        }
        
        // Servizio (opzionale)
        if (service != null && !service.trim().isEmpty()) {
            emailBody.append("<div class='field'>");
            emailBody.append("<strong>🎯 Servizio di Interesse</strong>");
            emailBody.append("<span class='badge'>").append(escapeHtml(service)).append("</span>");
            emailBody.append("</div>");
        }
        
        // Messaggio
        emailBody.append("<div class='message-box'>");
        emailBody.append("<strong style='color: #1351D8; display: block; margin-bottom: 10px;'>💬 Messaggio</strong>");
        emailBody.append(escapeHtml(message).replaceAll("\n", "<br>"));
        emailBody.append("</div>");
        
        // Metadata
        emailBody.append("<div style='background: white; padding: 15px; border-radius: 8px; font-size: 12px; color: #666;'>");
        emailBody.append("<strong style='color: #333;'>📊 Informazioni Aggiuntive</strong><br><br>");
        emailBody.append("<strong>Privacy Policy:</strong> ✅ Accettata<br>");
        if (newsletterAccept != null && newsletterAccept.equals("on")) {
            emailBody.append("<strong>Newsletter:</strong> ✅ Sottoscrizione richiesta<br>");
        }
        emailBody.append("<strong>Data/Ora:</strong> ").append(new Timestamp(currentTime).toString()).append("<br>");
        emailBody.append("<strong>IP Richiedente:</strong> ").append(clientIP).append("<br>");
        emailBody.append("<strong>User Agent:</strong> ").append(escapeHtml(request.getHeader("User-Agent"))).append("<br>");
        emailBody.append("</div>");
        
        emailBody.append("</div>"); // Fine content
        
        // Footer
        emailBody.append("<div class='footer'>");
        emailBody.append("<p style='margin: 0 0 10px 0;'><strong>Pamasoft</strong> | Elleffe sas</p>");
        emailBody.append("<p style='margin: 0;'>Via E. Fermi, 75 - 51100 Pistoia, Italia<br>");
        emailBody.append("P.IVA: 05657500483<br>");
        emailBody.append("<a href='mailto:info@pamasoft.com'>info@pamasoft.com</a> | ");
        emailBody.append("<a href='https://pamasoft.com'>pamasoft.com</a></p>");
        emailBody.append("<p style='margin: 15px 0 0 0; opacity: 0.7;'>Questa email è stata generata automaticamente dal form di contatto.</p>");
        emailBody.append("</div>");
        
        emailBody.append("</div></body></html>");
        
        // ========================================
        // COSTRUZIONE OGGETTO EMAIL
        // ========================================
        String subject = "🔔 Nuova Richiesta di Contatto";
        if (service != null && !service.trim().isEmpty()) {
            subject += " - " + service;
        }
        subject += " | " + firstName + " " + lastName;
        
        // ========================================
        // INVIO EMAIL CON AWS SES
        // ========================================
        SendMail sm = new SendMail(new EmailCredentialPamasoftErp(), TO_EMAIL, subject);
        sm.sendHtml(emailBody.toString());
        
        // ========================================
        // INCREMENTA CONTATORE RICHIESTE
        // ========================================
        session.setAttribute(sessionKey, requestCount + 1);
        session.setAttribute(sessionKey + "_time", currentTime);
        
        // ========================================
        // LOG SUCCESSO
        // ========================================
        System.out.println("[SUCCESS] Email sent from: " + email + " (IP: " + clientIP + ")");
        
        // ========================================
        // RISPOSTA SUCCESSO
        // ========================================
        out.println("<div class='alert-notification success'>");
        out.println("<i class='fas fa-check-circle'></i> ");
        out.println("<strong>Messaggio inviato con successo!</strong><br>");
        out.println("Grazie per averci contattato, " + escapeHtml(firstName) + ". Ti risponderemo entro 24 ore all'indirizzo <strong>" + escapeHtml(email) + "</strong>.");
        out.println("</div>");
        
        // Reset form via JavaScript
        String formId = (company != null && !company.isEmpty()) ? "contact-form-page" : "contact-form-home";
        out.println("<script>");
        out.println("setTimeout(function() {");
        out.println("  var form = document.getElementById('" + formId + "');");
        out.println("  if (form) form.reset();");
        out.println("}, 2000);");
        out.println("</script>");
        
    } catch (Exception e) {
        // ========================================
        // GESTIONE ERRORI
        // ========================================
        System.err.println("[ERROR] Contact form error: " + e.getMessage());
        e.printStackTrace();
        
        // Log dettagliato per debug
        System.err.println("Request details:");
        System.err.println("  IP: " + request.getRemoteAddr());
        System.err.println("  User-Agent: " + request.getHeader("User-Agent"));
        System.err.println("  Referer: " + request.getHeader("Referer"));
        
        out.println("<div class='alert-notification error'>");
        out.println("<i class='fas fa-exclamation-triangle'></i> ");
        out.println("<strong>Si è verificato un errore.</strong><br>");
        out.println("Per favore, riprova più tardi o contattaci direttamente via email a ");
        out.println("<a href='mailto:info@pamasoft.com' style='color: #721c24; text-decoration: underline;'>info@pamasoft.com</a>.");
        out.println("</div>");
    }
%>

<%!
    /**
     * Sanitizza l'input per prevenire XSS e injection
     */
    private String sanitizeInput(String input) {
        if (input == null) return null;
        
        // Trim whitespace
        input = input.trim();
        
        // Rimuovi caratteri di controllo
        input = input.replaceAll("[\\p{Cntrl}&&[^\r\n\t]]", "");
        
        // Limita caratteri consecutivi identici (anti-spam)
        input = input.replaceAll("(.)\\1{4,}", "$1$1$1");
        
        return input;
    }
    
    /**
     * Escape HTML per prevenire XSS
     */
    private String escapeHtml(String input) {
        if (input == null) return "";
        
        return input
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;")
            .replace("'", "&#x27;")
            .replace("/", "&#x2F;");
    }
%>


