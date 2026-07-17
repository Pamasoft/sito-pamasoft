# Guida Integrazione Form con JSP e AWS SES

## Panoramica

I form di contatto (homepage e pagina contatti) utilizzano **HTMX** per inviare richieste AJAX alla tua servlet JSP che gestisce l'invio email tramite AWS SES.

## Form Configurati

### 1. Form Homepage
- **ID**: `contact-form-home`
- **Endpoint**: `hx-post="[TUA_URL_JSP]/send-email"`
- **Target risposta**: `#form-response-home`
- **Indicatore loading**: `#loading-home`

### 2. Form Pagina Contatti
- **ID**: `contact-form-page`
- **Endpoint**: `hx-post="[TUA_URL_JSP]/send-email"`
- **Target risposta**: `#form-response-page`
- **Indicatore loading**: `#loading-page`

## Step 1: Aggiorna gli URL nei Form

Sostituisci `[TUA_URL_JSP]` con l'URL della tua servlet nei seguenti file:

### src/index.njk (riga 429)
```html
<form id="contact-form-home" hx-post="https://tuodominio.com/send-email" ...>
```

### src/contatti.njk (riga 124)
```html
<form id="contact-form-page" hx-post="https://tuodominio.com/send-email" ...>
```

## Step 2: Esempio JSP con SendMail (AWS SES)

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*, com.yourpackage.SendMail" %>
<%
    // Imposta header per risposta HTML
    response.setContentType("text/html; charset=UTF-8");
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    response.setHeader("Pragma", "no-cache");
    response.setDateHeader("Expires", 0);

    try {
        // Recupera i parametri del form
        String firstName = request.getParameter("first_name");
        String lastName = request.getParameter("last_name");
        String email = request.getParameter("email");
        String company = request.getParameter("company"); // Solo in pagina contatti
        String phonePrefix = request.getParameter("phone_prefix");
        String phoneNumber = request.getParameter("phone_number");
        String service = request.getParameter("service"); // Solo in pagina contatti
        String message = request.getParameter("message");
        String privacyAccept = request.getParameter("privacy_accept");
        String newsletterAccept = request.getParameter("newsletter_accept"); // Solo in pagina contatti

        // Validazione base
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

        // Validazione email
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        if (!email.matches(emailRegex)) {
            out.println("<div class='alert-notification error'>");
            out.println("<i class='fas fa-exclamation-circle'></i> ");
            out.println("Indirizzo email non valido.");
            out.println("</div>");
            return;
        }

        // Costruisci il corpo dell'email
        StringBuilder emailBody = new StringBuilder();
        emailBody.append("<html><body style='font-family: Arial, sans-serif;'>");
        emailBody.append("<h2 style='color: #1351D8;'>Nuova Richiesta di Contatto - Pamasoft</h2>");
        emailBody.append("<div style='background: #f8f9fa; padding: 20px; border-radius: 8px;'>");
        
        emailBody.append("<p><strong>Nome:</strong> ").append(firstName).append(" ").append(lastName).append("</p>");
        emailBody.append("<p><strong>Email:</strong> <a href='mailto:").append(email).append("'>").append(email).append("</a></p>");
        
        if (company != null && !company.trim().isEmpty()) {
            emailBody.append("<p><strong>Azienda:</strong> ").append(company).append("</p>");
        }
        
        if (phoneNumber != null && !phoneNumber.trim().isEmpty()) {
            String fullPhone = (phonePrefix != null ? phonePrefix + " " : "") + phoneNumber;
            emailBody.append("<p><strong>Telefono:</strong> ").append(fullPhone).append("</p>");
        }
        
        if (service != null && !service.trim().isEmpty()) {
            emailBody.append("<p><strong>Servizio di Interesse:</strong> ").append(service).append("</p>");
        }
        
        emailBody.append("<p><strong>Messaggio:</strong></p>");
        emailBody.append("<div style='background: white; padding: 15px; border-left: 4px solid #1351D8; margin: 10px 0;'>");
        emailBody.append(message.replaceAll("\n", "<br>"));
        emailBody.append("</div>");
        
        emailBody.append("<hr style='margin: 20px 0; border: none; border-top: 1px solid #dee2e6;'>");
        emailBody.append("<p style='font-size: 12px; color: #666;'>");
        emailBody.append("<strong>Privacy Policy:</strong> Accettata<br>");
        if (newsletterAccept != null && newsletterAccept.equals("on")) {
            emailBody.append("<strong>Newsletter:</strong> Sottoscrizione richiesta<br>");
        }
        emailBody.append("<strong>Data invio:</strong> ").append(new Date().toString());
        emailBody.append("</p>");
        
        emailBody.append("</div>");
        emailBody.append("<p style='margin-top: 20px; font-size: 12px; color: #999;'>");
        emailBody.append("Questa email è stata generata automaticamente dal form di contatto di Pamasoft.com<br>");
        emailBody.append("Elleffe sas - Via E. Fermi, 75 - 51100 Pistoia - P.IVA 05657500483");
        emailBody.append("</p>");
        emailBody.append("</body></html>");

        // Usa la tua classe SendMail con AWS SES
        SendMail mailer = new SendMail();
        
        // Parametri email
        String toEmail = "info@pamasoft.com"; // Destinatario
        String fromEmail = "noreply@pamasoft.com"; // Mittente (verificato in AWS SES)
        String subject = "Nuova Richiesta di Contatto da " + firstName + " " + lastName;
        String bodyHtml = emailBody.toString();
        
        // Invia email
        boolean emailSent = mailer.sendEmail(toEmail, fromEmail, subject, bodyHtml);
        
        if (emailSent) {
            // Risposta di successo
            out.println("<div class='alert-notification success'>");
            out.println("<i class='fas fa-check-circle'></i> ");
            out.println("<strong>Messaggio inviato con successo!</strong><br>");
            out.println("Ti risponderemo entro 24 ore.");
            out.println("</div>");
            
            // Reset form (opzionale, tramite HTMX)
            out.println("<script>document.getElementById('" + 
                       (company != null ? "contact-form-page" : "contact-form-home") + 
                       "').reset();</script>");
        } else {
            throw new Exception("Errore nell'invio dell'email");
        }
        
    } catch (Exception e) {
        // Log dell'errore (usa il tuo sistema di logging)
        System.err.println("Errore invio form: " + e.getMessage());
        e.printStackTrace();
        
        // Risposta di errore
        out.println("<div class='alert-notification error'>");
        out.println("<i class='fas fa-exclamation-triangle'></i> ");
        out.println("<strong>Errore nell'invio del messaggio.</strong><br>");
        out.println("Per favore, riprova più tardi o contattaci via email a <a href='mailto:info@pamasoft.com'>info@pamasoft.com</a>.");
        out.println("</div>");
    }
%>
```

## Step 3: Esempio Classe SendMail (AWS SES)

```java
package com.yourpackage;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailService;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailServiceClientBuilder;
import com.amazonaws.services.simpleemail.model.*;

public class SendMail {
    
    // Configura le tue credenziali AWS (meglio usare IAM Role o environment variables)
    private static final String AWS_ACCESS_KEY = System.getenv("AWS_ACCESS_KEY_ID");
    private static final String AWS_SECRET_KEY = System.getenv("AWS_SECRET_ACCESS_KEY");
    private static final Regions AWS_REGION = Regions.EU_WEST_1; // Cambia in base alla tua region
    
    public boolean sendEmail(String to, String from, String subject, String bodyHtml) {
        try {
            // Crea le credenziali AWS
            BasicAWSCredentials awsCreds = new BasicAWSCredentials(AWS_ACCESS_KEY, AWS_SECRET_KEY);
            
            // Crea il client SES
            AmazonSimpleEmailService client = AmazonSimpleEmailServiceClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(awsCreds))
                .withRegion(AWS_REGION)
                .build();
            
            // Crea la richiesta di invio
            SendEmailRequest request = new SendEmailRequest()
                .withDestination(new Destination().withToAddresses(to))
                .withMessage(new Message()
                    .withBody(new Body()
                        .withHtml(new Content().withCharset("UTF-8").withData(bodyHtml)))
                    .withSubject(new Content().withCharset("UTF-8").withData(subject)))
                .withSource(from)
                // Opzionale: reply-to
                .withReplyToAddresses("info@pamasoft.com");
            
            // Invia l'email
            SendEmailResult result = client.sendEmail(request);
            
            System.out.println("Email inviata! Message ID: " + result.getMessageId());
            return true;
            
        } catch (Exception ex) {
            System.err.println("Errore invio email SES: " + ex.getMessage());
            ex.printStackTrace();
            return false;
        }
    }
}
```

## Step 4: Configurazione AWS SES

### Prerequisiti
1. **Account AWS** con SES abilitato
2. **Verifica email/dominio** in AWS SES Console
   - Verifica `noreply@pamasoft.com` (mittente)
   - Verifica `info@pamasoft.com` (destinatario) se in sandbox mode
3. **IAM User** con policy `AmazonSESFullAccess`
4. **Credenziali AWS** configurate (access key + secret key)

### Muovere SES fuori dalla Sandbox
Se sei in sandbox mode, puoi inviare email solo a indirizzi verificati.
Per produzione, richiedi l'uscita dalla sandbox:
- AWS Console → SES → Account Dashboard → "Request production access"

### Best Practices
- Usa **IAM Roles** invece di credenziali hardcoded
- Abilita **DKIM** e **SPF** per il dominio
- Monitora **bounce rate** e **complaint rate**
- Implementa **logging** delle email inviate
- Configura **SNS notifications** per bounce/complaints

## Step 5: Configurazione CORS (se necessario)

Se la tua JSP è su un dominio diverso da pamasoft.com, aggiungi header CORS:

```jsp
<%
    // CORS headers
    response.setHeader("Access-Control-Allow-Origin", "https://pamasoft.com");
    response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    
    // Handle preflight
    if (request.getMethod().equals("OPTIONS")) {
        response.setStatus(HttpServletResponse.SC_OK);
        return;
    }
%>
```

## Step 6: Test dell'Integrazione

### Test Locale
1. Avvia il server con la JSP
2. Aggiorna gli URL nei form
3. Compila e invia il form
4. Verifica:
   - Spinner di caricamento appare
   - Messaggio di successo/errore appare
   - Email ricevuta su info@pamasoft.com
   - Form si resetta (opzionale)

### Test in Produzione
1. Deploy su Netlify del sito statico
2. Deploy della JSP sul tuo server
3. Test end-to-end
4. Monitor AWS CloudWatch per log SES

## Campi Form

### Form Homepage (contact-form-home)
- `first_name` (required)
- `last_name` (required)
- `email` (required)
- `phone_prefix` (optional)
- `phone_number` (optional)
- `message` (required)
- `privacy_accept` (required)

### Form Pagina Contatti (contact-form-page)
- `first_name` (required)
- `last_name` (required)
- `email` (required)
- `company` (optional)
- `phone_prefix` (optional)
- `phone_number` (optional)
- `service` (optional)
- `message` (required)
- `privacy_accept` (required)
- `newsletter_accept` (optional)

## Sicurezza

### Validazioni da Implementare
1. ✅ **Input sanitization** - Escape HTML/JS
2. ✅ **Email validation** - Regex + formato
3. ✅ **Rate limiting** - Max richieste per IP
4. ✅ **Honeypot field** - Campo nascosto anti-spam
5. ✅ **CSRF token** - Protezione CSRF
6. ✅ **reCAPTCHA** - Google reCAPTCHA v3 (consigliato)

### Esempio Rate Limiting (Java)
```java
// In sessione o cache (Redis)
String clientIP = request.getRemoteAddr();
Integer requestCount = (Integer) session.getAttribute("form_requests_" + clientIP);

if (requestCount == null) {
    requestCount = 0;
}

if (requestCount >= 3) { // Max 3 richieste per sessione
    out.println("<div class='alert-notification error'>");
    out.println("Troppi tentativi. Riprova tra 10 minuti.");
    out.println("</div>");
    return;
}

session.setAttribute("form_requests_" + clientIP, requestCount + 1);
```

## Alternative Consigliate

### 1. Serverless con AWS Lambda
- **Vantaggi**: Scalabile, no server management, pay-per-use
- **Stack**: API Gateway + Lambda (Java/Node) + SES
- **Costo**: ~$0.20 per milione di richieste

### 2. Netlify Functions
- **Vantaggi**: Integrato con Netlify, deploy automatico
- **Stack**: JavaScript/TypeScript + SES SDK
- **Costo**: Incluso nel piano Netlify

### 3. FormSpree / Formspark
- **Vantaggi**: No backend, pronto all'uso
- **Stack**: SaaS form backend
- **Costo**: Free tier disponibile

## Support

Per domande o problemi:
- Email: info@pamasoft.com
- Documentazione AWS SES: https://docs.aws.amazon.com/ses/

---

**Ultima modifica**: Ottobre 2025  
**Versione**: 1.0  
**Elleffe sas** - P.IVA 05657500483


