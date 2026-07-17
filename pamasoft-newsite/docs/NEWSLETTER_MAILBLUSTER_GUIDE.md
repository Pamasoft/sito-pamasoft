# 📧 Newsletter MailBluster - Guida Integrazione

## 📋 Overview

Sistema di iscrizione newsletter con:
- ✅ **Double Opt-In** automatico via MailBluster
- ✅ **Privacy Policy** obbligatoria
- ✅ **Protezione anti-bot** (honeypot + rate limiting)
- ✅ **API MailBluster** con Unirest (Mashape)
- ✅ **Tag automatici** (`website`, `footer-newsletter`)
- ✅ **Gestione IP** per tracking e compliance

---

## 🔧 File Creati

### 1. `subscribe-newsletter.jsp`
Servlet per gestione iscrizioni con integrazione MailBluster API.

**Endpoint:** `https://erp.pamasoft.com/subscribe-newsletter.jsp`

### 2. `footer.njk` (aggiornato)
Form newsletter con:
- Campo email
- Checkbox privacy obbligatoria
- Honeypot nascosto
- Loading spinner
- Area risposta dinamica

### 3. `contact-form-handler.js` (aggiornato)
JavaScript che gestisce invio form newsletter con Fetch API.

---

## 📦 Dipendenze Java Richieste

Il JSP richiede le seguenti librerie nel classpath:

```xml
<!-- Maven Dependencies -->
<dependency>
    <groupId>com.mashape.unirest</groupId>
    <artifactId>unirest-java</artifactId>
    <version>1.4.9</version>
</dependency>

<dependency>
    <groupId>org.json</groupId>
    <artifactId>json</artifactId>
    <version>20210307</version>
</dependency>
```

**O scarica i JAR manualmente:**
- `unirest-java-1.4.9.jar`
- `json-20210307.jar`
- `httpclient-4.5.13.jar` (dipendenza di Unirest)
- `httpcore-4.4.14.jar` (dipendenza di Unirest)
- `httpasyncclient-4.1.4.jar` (dipendenza di Unirest)
- `httpmime-4.5.13.jar` (dipendenza di Unirest)

**Percorso Tomcat:**
```
/var/lib/tomcat/lib/
```

---

## 🔑 Configurazione MailBluster API

### API Key
```java
final String MAILBLUSTER_API_KEY = "8db66c67-345a-408b-a86a-75ffbae3aa79";
```

⚠️ **IMPORTANTE:** Sostituisci questa chiave con la tua API key di MailBluster!

**Dove trovarla:**
1. Login su [MailBluster](https://app.mailbluster.com)
2. Vai su **Settings → API**
3. Copia la tua API Key

### Endpoint API
```java
final String MAILBLUSTER_API_URL = "https://api.mailbluster.com/api/leads";
```

---

## 📤 Payload Inviato a MailBluster

```json
{
  "email": "utente@esempio.com",
  "ipAddress": "192.168.1.1",
  "subscribed": true,
  "doubleOptIn": true,
  "tags": ["website", "footer-newsletter"]
}
```

### Parametri:
- **email**: Email dell'utente (validata lato client e server)
- **ipAddress**: IP del richiedente (per compliance GDPR)
- **subscribed**: `true` (iscrizione attiva)
- **doubleOptIn**: `true` ⚠️ **IMPORTANTE!** Invia email di conferma automatica
- **tags**: Array di tag per segmentare i contatti

---

## 🔒 Protezioni Implementate

### 1. **Rate Limiting**
- Max **3 iscrizioni per IP** per sessione
- Reset automatico dopo 1 ora

### 2. **Honeypot**
- Campo nascosto `website`
- Se compilato → iscrizione ignorata (bot detected)

### 3. **Validazione Email**
- Regex lato client e server
- Blocco domini temporanei:
  - `tempmail`, `throwaway`, `guerrillamail`
  - `10minutemail`, `mailinator`, `trash-mail`
  - `fakeinbox`, `temp-mail`

### 4. **Privacy Policy Obbligatoria**
- Checkbox required
- Validazione lato client e server

### 5. **CORS**
- Solo origini autorizzate:
  - `https://pamasoft.com`
  - `https://www.pamasoft.com`
  - `http://localhost:8080` (dev)

---

## 📊 Risposte MailBluster API

### Successo (200/201)
```html
<div class='alert-notification success'>
  <i class='fas fa-check-circle'></i> 
  <strong>Iscrizione quasi completata!</strong><br>
  Ti abbiamo inviato un'email di conferma...
</div>
```

### Email già registrata (409)
```html
<div class='alert-notification warning'>
  <i class='fas fa-info-circle'></i> 
  <strong>Email già registrata.</strong><br>
  Questo indirizzo è già iscritto...
</div>
```

### Validazione fallita (422)
```html
<div class='alert-notification error'>
  <i class='fas fa-exclamation-triangle'></i> 
  <strong>Errore di validazione.</strong><br>
  [messaggio da MailBluster]
</div>
```

### Errore connessione
```html
<div class='alert-notification error'>
  <i class='fas fa-exclamation-triangle'></i> 
  <strong>Errore di connessione.</strong><br>
  Non è stato possibile contattare il servizio...
</div>
```

---

## 🧪 Test dell'Integrazione

### 1. Test API con curl

```bash
curl -X POST https://api.mailbluster.com/api/leads \
  -H "Authorization: TUA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@esempio.com",
    "ipAddress": "127.0.0.1",
    "subscribed": true,
    "doubleOptIn": true,
    "tags": ["test"]
  }'
```

**Risposta attesa:**
```json
{
  "id": "abc123",
  "email": "test@esempio.com",
  "status": "pending",
  ...
}
```

### 2. Test Form Frontend

1. Apri `https://pamasoft.com`
2. Scrolla fino al footer
3. Inserisci email nel campo newsletter
4. Spunta privacy policy
5. Click "Iscriviti"
6. Verifica messaggio di successo
7. **Controlla email** per Double Opt-In
8. Click sul link di conferma nell'email

### 3. Verifica su MailBluster

1. Login su MailBluster
2. Vai su **Leads**
3. Cerca l'email di test
4. Verifica:
   - Status: `confirmed` (dopo click su double opt-in)
   - Tags: `website`, `footer-newsletter`
   - IP Address presente

---

## 🐛 Debug & Troubleshooting

### Abilitare Debug Dettagliato

Il JSP logga automaticamente su `catalina.out`:

```bash
tail -f /var/log/tomcat/catalina.out | grep "MAILBLUSTER"
```

**Output esempio:**
```
=== MAILBLUSTER API - Newsletter Subscription ===
Email: test@esempio.com
IP Address: 192.168.1.100
Timestamp: 2025-10-09 10:30:45
Payload: {"email":"test@esempio.com","ipAddress":"192.168.1.100",...}
=== MailBluster Response ===
Status Code: 201
Response Body: {"id":"xyz789","email":"test@esempio.com",...}
✓ Lead creato con successo su MailBluster
Lead ID: xyz789
=== End MailBluster API Call ===
```

### Errori Comuni

#### 1. `UnirestException: Connection refused`
**Causa:** Server non riesce a contattare MailBluster API

**Soluzioni:**
- Verifica connessione internet del server
- Controlla firewall (porta 443 HTTPS)
- Verifica DNS risolve `api.mailbluster.com`

```bash
# Test connessione
curl -I https://api.mailbluster.com
```

#### 2. `HTTP 401 Unauthorized`
**Causa:** API Key non valida

**Soluzione:**
- Verifica API Key in `subscribe-newsletter.jsp`
- Genera nuova API Key su MailBluster se necessario

#### 3. `HTTP 422 Unprocessable Entity`
**Causa:** Email non valida o dati mancanti

**Soluzione:**
- Verifica formato email
- Controlla che tutti i campi required siano presenti
- Leggi `message` nella risposta JSON per dettagli

#### 4. `ClassNotFoundException: com.mashape.unirest.http.*`
**Causa:** Librerie Unirest non in classpath

**Soluzione:**
```bash
# Verifica presenza JAR
ls -la /var/lib/tomcat/lib/ | grep unirest

# Se mancanti, scarica e copia
wget https://repo1.maven.org/maven2/com/mashape/unirest/unirest-java/1.4.9/unirest-java-1.4.9.jar
cp unirest-java-1.4.9.jar /var/lib/tomcat/lib/
sudo systemctl restart tomcat
```

#### 5. Form non invia (console browser)
**Causa:** CORS o JavaScript non caricato

**Soluzione:**
1. Apri DevTools Console (F12)
2. Verifica: `Pamasoft Contact Form Handler Initialized ✓`
3. Se manca, controlla che `contact-form-handler.js` sia caricato
4. Verifica CORS headers nella risposta OPTIONS

---

## 📝 Double Opt-In Flow

1. **User compila form** → Click "Iscriviti"
2. **Frontend** → Validazione + invio a JSP
3. **JSP** → Validazione server-side
4. **JSP** → Chiamata MailBluster API con `doubleOptIn: true`
5. **MailBluster** → Crea lead con status `pending`
6. **MailBluster** → Invia email con link conferma
7. **User** → Riceve email, click su link
8. **MailBluster** → Status diventa `confirmed`
9. **User** → Ora nella lista newsletter attiva!

---

## 🎨 Personalizzazione Email Double Opt-In

Le email di conferma sono configurabili su MailBluster:

1. Login su MailBluster
2. **Settings → Email Templates**
3. Modifica template **Double Opt-In Confirmation**
4. Personalizza:
   - Subject
   - Testo
   - Call-to-action button
   - Footer

---

## 🛡️ Prevenire Email in Spam - Configurazione Dominio Personalizzato

### ⚠️ Problema
Le email di MailBluster possono finire in spam perché usano un mittente generico. La soluzione è configurare un **dominio personalizzato** (pamasoft.com).

### ✅ Soluzione: Configurare Dominio Personalizzato

#### Passo 1: Configurazione in MailBluster

1. Login su [MailBluster](https://app.mailbluster.com)
2. Vai su **Settings → Domains**
3. Clicca **Add Domain** o **Verify Domain**
4. Inserisci: `pamasoft.com` (o `mail.pamasoft.com` come subdomain)
5. MailBluster ti fornirà i record DNS da aggiungere

#### Passo 2: Configurazione DNS

Aggiungi questi record DNS nel tuo provider (es. Cloudflare, AWS Route53):

##### **SPF Record** (TXT)
```
Tipo: TXT
Nome: @ (o pamasoft.com)
Valore: v=spf1 include:mailbluster.com ~all
TTL: 3600
```

##### **DKIM Record** (TXT)
```
Tipo: TXT
Nome: mailbluster._domainkey (o mailbluster._domainkey.pamasoft.com)
Valore: [fornito da MailBluster - chiave pubblica DKIM]
TTL: 3600
```

##### **DMARC Record** (TXT) - Opzionale ma Consigliato
```
Tipo: TXT
Nome: _dmarc (o _dmarc.pamasoft.com)
Valore: v=DMARC1; p=quarantine; rua=mailto:dmarc@pamasoft.com
TTL: 3600
```

##### **CNAME per Tracking** (se richiesto da MailBluster)
```
Tipo: CNAME
Nome: mailbluster (o mailbluster.pamasoft.com)
Valore: [fornito da MailBluster]
TTL: 3600
```

#### Passo 3: Verifica DNS

1. Attendi propagazione DNS (5-30 minuti)
2. In MailBluster, clicca **Verify Domain**
3. Se tutto OK, vedrai ✅ **Domain Verified**

#### Passo 4: Imposta Dominio come Default

1. In MailBluster, vai su **Settings → Domains**
2. Seleziona `pamasoft.com` come **Default Sending Domain**
3. Le email ora partiranno da `noreply@pamasoft.com` o `newsletter@pamasoft.com`

### 📧 From Address Personalizzato

Dopo aver configurato il dominio, puoi personalizzare il mittente:

1. **Settings → Email Templates → Double Opt-In Confirmation**
2. Modifica **From Name**: `Pamasoft` o `Pamasoft Newsletter`
3. **From Email**: `newsletter@pamasoft.com` (verrà verificato automaticamente)

### ✅ Best Practices per Evitare Spam

1. **SPF, DKIM, DMARC configurati** ✅ (vedi sopra)
2. **From address del tuo dominio** ✅ (`newsletter@pamasoft.com`)
3. **Subject line chiaro** ✅ (es. "Conferma la tua iscrizione a Pamasoft Newsletter")
4. **Contenuto email professionale** ✅
5. **Link di unsubscribe funzionante** ✅ (gestito automaticamente da MailBluster)
6. **Warm-up del dominio** ⚠️ (invia gradualmente le prime email)

### 🔍 Verifica Deliverability

Dopo la configurazione, testa con:
- [Mail-Tester](https://www.mail-tester.com) - Score 10/10
- [MXToolbox](https://mxtoolbox.com/spf.aspx) - Verifica SPF
- [DKIM Validator](https://dkimvalidator.com/) - Verifica DKIM

### 📊 Monitoraggio

In MailBluster Dashboard:
- **Deliverability Rate**: Dovrebbe essere >95%
- **Bounce Rate**: Dovrebbe essere <2%
- **Spam Complaints**: Dovrebbe essere <0.1%

---

### 🚨 Troubleshooting

#### Email ancora in spam dopo configurazione?

1. **Verifica DNS propagati**: Usa `dig` o `nslookup`
   ```bash
   dig TXT pamasoft.com
   dig TXT mailbluster._domainkey.pamasoft.com
   ```

2. **Controlla SPF**: Deve includere `include:mailbluster.com`
   ```bash
   dig TXT pamasoft.com | grep spf
   ```

3. **Warm-up del dominio**: Invia gradualmente (10, 50, 100 email/giorno)

4. **Contenuto email**: Evita parole trigger (FREE, CLICK HERE, etc.)

5. **Lista pulita**: Rimuovi email bounce/invalide regolarmente

---

## 📊 Analytics & Reporting

### Metriche disponibili su MailBluster:
- **Total Leads**: Iscritti totali
- **Confirmed**: Email confermate
- **Pending**: In attesa di conferma
- **Unsubscribed**: Disiscritti
- **Bounced**: Email non valide

### Segmentazione per Tag:
- Filtra per tag: `website` o `footer-newsletter`
- Crea campagne specifiche per fonte di iscrizione

---

## 🔄 Gestione Disiscrizioni

MailBluster gestisce automaticamente:
- Link "Unsubscribe" in ogni email
- Status cambio automatico
- Compliance GDPR

---

## ✅ Checklist Deployment

- [ ] API Key MailBluster aggiornata nel JSP
- [ ] Librerie Unirest/JSON nel classpath Tomcat
- [ ] JSP caricato su `erp.pamasoft.com`
- [ ] CORS configurato correttamente
- [ ] Test invio form da frontend
- [ ] Email double opt-in ricevuta
- [ ] Link conferma funzionante
- [ ] Lead visibile su MailBluster dashboard
- [ ] Tag corretti applicati
- [ ] Log Tomcat verificati
- [ ] Rate limiting testato (3 iscrizioni)
- [ ] Honeypot testato (deve ignorare bot)
- [ ] Domini temporanei bloccati

---

## 📞 Supporto

- **MailBluster Docs**: https://app.mailbluster.com/api-doc/leads
- **Email**: info@pamasoft.com
- **File JSP**: `subscribe-newsletter.jsp`
- **Frontend**: `footer.njk`, `contact-form-handler.js`

---

**Versione:** 1.0  
**Data:** Ottobre 2025  
**Autore:** Pamasoft Development Team

🚀 **Buon deployment!**

