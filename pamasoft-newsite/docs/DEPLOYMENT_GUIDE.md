# 🚀 Guida al Deployment - Pamasoft Contact Form

## 📋 Prerequisiti

- Server Tomcat o altro application server Java
- Java 17+
- Accesso al server `erp.pamasoft.com`
- Librerie AWS SES configurate
- Classi `SendMail` e `EmailCredentialPamasoft` già presenti nel classpath

---

## 📤 Deployment del File JSP

### 1. **Carica il File JSP**

Carica `send-email.jsp` sul server **erp.pamasoft.com** nella directory web root o in una sottocartella accessibile.

**Percorso suggerito:**
```
/var/lib/tomcat/webapps/ROOT/send-email.jsp
```

O se hai un context path specifico:
```
/var/lib/tomcat/webapps/erp/send-email.jsp
```

### 2. **Verifica il Path**

L'URL finale deve essere:
```
https://erp.pamasoft.com/send-email.jsp
```

### 3. **Permessi File**

Assicurati che il file abbia i permessi corretti:
```bash
chmod 644 send-email.jsp
chown tomcat:tomcat send-email.jsp
```

---

## 🔐 Configurazione CORS

Il file JSP include già la configurazione CORS per:
- ✅ `https://pamasoft.com`
- ✅ `https://www.pamasoft.com`
- ✅ `http://localhost:8080` (solo per test locali)

**Header CORS configurati:**
```java
Access-Control-Allow-Origin: https://pamasoft.com
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, HX-Request, HX-Target, HX-Current-URL
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 3600
```

**⚠️ Importante:** Il JSP gestisce automaticamente le richieste OPTIONS (preflight).

---

## 🧪 Test del Deployment

### Test 1: Verifica che il file JSP risponda

```bash
curl -I https://erp.pamasoft.com/send-email.jsp
```

**Output atteso:**
```
HTTP/1.1 405 Method Not Allowed
```
(405 è corretto perché il JSP accetta solo POST)

### Test 2: Verifica CORS con OPTIONS

```bash
curl -X OPTIONS https://erp.pamasoft.com/send-email.jsp \
  -H "Origin: https://pamasoft.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

**Output atteso:**
Dovresti vedere questi header nella risposta:
```
Access-Control-Allow-Origin: https://pamasoft.com
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, HX-Request, HX-Target, HX-Current-URL
```

### Test 3: Invio Form Reale dal Browser

1. Vai su `https://pamasoft.com`
2. Compila il form di contatto nella homepage
3. Invia il form
4. Apri DevTools Console (F12)
5. Verifica che non ci siano errori CORS

---

## 🛠️ Troubleshooting

### Errore: "No 'Access-Control-Allow-Origin' header"

**Causa:** Il file JSP non è stato caricato sul server o non ha i permessi corretti.

**Soluzione:**
1. Verifica che il file sia presente su `erp.pamasoft.com`
2. Riavvia Tomcat: `sudo systemctl restart tomcat`
3. Controlla i log: `tail -f /var/log/tomcat/catalina.out`

### Errore: "preflight request doesn't pass"

**Causa:** Il server non gestisce correttamente le richieste OPTIONS.

**Soluzione:**
1. Verifica che il JSP sia aggiornato all'ultima versione
2. Controlla che non ci siano filtri servlet che bloccano OPTIONS
3. Verifica il file `web.xml` (se presente) non blocchi OPTIONS

### Errore: "SendMail class not found"

**Causa:** Le classi Java custom non sono nel classpath.

**Soluzione:**
1. Verifica che il package sia corretto: `com.yourpackage`
2. Aggiorna il package name nel JSP se necessario:
```java
<%@ page import="com.ACTUAL_PACKAGE.SendMail, com.ACTUAL_PACKAGE.EmailCredentialPamasoft" %>
```

### Errore: "Rate limit exceeded"

**Causa:** Hai inviato troppi form dallo stesso IP.

**Soluzione:**
1. Attendi 1 ora (il rate limit si resetta automaticamente)
2. O riavvia Tomcat per pulire la sessione
3. Per test, aumenta temporaneamente `MAX_REQUESTS_PER_IP`

---

## 📊 Monitoraggio

### Log delle Email Inviate

Il JSP logga ogni richiesta. Controlla i log di Tomcat:

```bash
tail -f /var/log/tomcat/catalina.out | grep "PAMASOFT"
```

### Verificare Rate Limiting

Le sessioni vengono salvate in memoria. Per vedere le sessioni attive:

```bash
# Usa JMX o Tomcat Manager
http://erp.pamasoft.com:8080/manager/html
```

---

## 🔒 Sicurezza

Il JSP include **12 livelli di protezione anti-bot**:

1. ✅ Honeypot field (campo nascosto)
2. ✅ Timestamp validation (tempo compilazione)
3. ✅ Rate limiting per IP
4. ✅ Input sanitization
5. ✅ Email validation (regex)
6. ✅ Spam keyword detection
7. ✅ Message length check
8. ✅ CORS protection
9. ✅ Security headers
10. ✅ Client-side validation
11. ✅ Method restriction (solo POST)
12. ✅ Session-based tracking

**⚠️ Non modificare** le validazioni senza comprenderne l'impatto sulla sicurezza.

---

## 🌐 Domini Consentiti

Per aggiungere altri domini (es. staging), modifica questa sezione nel JSP:

```java
if (origin != null && (
    origin.equals("https://pamasoft.com") || 
    origin.equals("https://www.pamasoft.com") ||
    origin.equals("https://staging.pamasoft.com") // <-- AGGIUNGI QUI
)) {
    // ...
}
```

---

## 📧 Configurazione Email

Il JSP invia email a: **info@pamasoft.com**

Per cambiare l'email destinatario, modifica questa costante:

```java
final String TO_EMAIL = "info@pamasoft.com"; // <-- Cambia qui
```

---

## 🔄 Backup e Rollback

### Prima del Deploy

```bash
# Backup del file attuale (se esiste)
cp /var/lib/tomcat/webapps/ROOT/send-email.jsp /var/lib/tomcat/webapps/ROOT/send-email.jsp.backup.$(date +%Y%m%d)
```

### Rollback

```bash
# Ripristina il backup
cp /var/lib/tomcat/webapps/ROOT/send-email.jsp.backup.20241009 /var/lib/tomcat/webapps/ROOT/send-email.jsp
sudo systemctl restart tomcat
```

---

## ✅ Checklist Pre-Deploy

- [ ] Backup del file esistente effettuato
- [ ] Package Java corretto nel file JSP
- [ ] Permessi file corretti (644)
- [ ] Tomcat riavviato dopo il deploy
- [ ] Test CORS superato
- [ ] Test invio form dalla homepage superato
- [ ] Test invio form dalla pagina contatti superato
- [ ] Email di test ricevuta correttamente
- [ ] Log verificati per eventuali errori
- [ ] Rate limiting testato

---

## 📞 Supporto

Per problemi o domande:
- Email: info@pamasoft.com
- File: `send-email.jsp`
- Versione: 1.0
- Ultima modifica: Ottobre 2025

---

## 🎯 Prossimi Passi

Dopo il deployment:

1. ✅ Testa il form dalla homepage
2. ✅ Testa il form dalla pagina contatti
3. ✅ Verifica che le email arrivino a `info@pamasoft.com`
4. ✅ Monitora i log per 24-48 ore
5. ✅ Se tutto funziona, rimuovi `localhost:8080` dai domini CORS consentiti

Buon deployment! 🚀

