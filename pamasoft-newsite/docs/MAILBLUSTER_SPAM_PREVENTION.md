# 🛡️ Prevenire Email in Spam - MailBluster

## 📋 Problema

Le email di conferma MailBluster finiscono in **spam** anche con dominio verificato. Cause comuni:
- Subject line con parole trigger
- Contenuto email non ottimizzato
- Template email non personalizzato
- Mancanza di testo plain-text
- Link non formattati correttamente
- Warm-up del dominio insufficiente

## ✅ Soluzioni per Migliorare Deliverability

Se il dominio è già verificato (SES + MailBluster), concentrati su questi aspetti:

---

## 🔧 Configurazione Step-by-Step

### 1. Login MailBluster

1. Vai su [app.mailbluster.com](https://app.mailbluster.com)
2. Login con le tue credenziali

### 2. Aggiungi Dominio

1. **Settings → Domains** (o **Sending Domains**)
2. Clicca **Add Domain** o **Verify Domain**
3. Inserisci: `pamasoft.com`
4. Clicca **Continue** o **Verify**

### 3. Configura DNS Records

MailBluster ti mostrerà i record DNS da aggiungere. Configurali nel tuo provider DNS (Cloudflare, AWS Route53, etc.).

#### **SPF Record** (TXT)

```
Tipo: TXT
Nome: @ (o pamasoft.com)
Valore: v=spf1 include:mailbluster.com ~all
TTL: 3600 (o Auto)
```

**Spiegazione**: Autorizza MailBluster a inviare email per conto di pamasoft.com

#### **DKIM Record** (TXT)

```
Tipo: TXT
Nome: mailbluster._domainkey (o mailbluster._domainkey.pamasoft.com)
Valore: [chiave pubblica fornita da MailBluster - molto lunga]
TTL: 3600
```

**Spiegazione**: Firma digitale per autenticare le email

#### **DMARC Record** (TXT) - Opzionale ma Consigliato

```
Tipo: TXT
Nome: _dmarc (o _dmarc.pamasoft.com)
Valore: v=DMARC1; p=quarantine; rua=mailto:dmarc@pamasoft.com; pct=100
TTL: 3600
```

**Spiegazione**: Policy per gestire email non autenticate

#### **CNAME per Tracking** (se richiesto)

```
Tipo: CNAME
Nome: mailbluster (o mailbluster.pamasoft.com)
Valore: [fornito da MailBluster]
TTL: 3600
```

### 4. Verifica DNS

1. Attendi **5-30 minuti** per propagazione DNS
2. In MailBluster, clicca **Verify Domain** o **Check DNS**
3. Se tutti i record sono OK, vedrai ✅ **Domain Verified**

### 5. Imposta come Default

1. In **Settings → Domains**
2. Seleziona `pamasoft.com`
3. Clicca **Set as Default** o **Make Default**

---

## 📧 Configurazione From Address

Dopo aver verificato il dominio:

1. **Settings → Email Templates**
2. Seleziona **Double Opt-In Confirmation**
3. Modifica:
   - **From Name**: `Pamasoft` o `Pamasoft Newsletter`
   - **From Email**: `newsletter@pamasoft.com` o `noreply@pamasoft.com`
4. Salva

Le email ora partiranno da `newsletter@pamasoft.com` invece di `noreply@mailbluster.com`

---

## ✅ Best Practices

### 1. **Autenticazione Email** ✅
- SPF configurato
- DKIM configurato
- DMARC configurato (opzionale ma consigliato)

### 2. **From Address Professionale** ✅
- Usa `newsletter@pamasoft.com` invece di generico
- Nome mittente chiaro: "Pamasoft"

### 3. **Subject Line** ✅
- Evita maiuscole eccessive: ❌ "CONFERMA SUBITO!"
- Usa testo chiaro: ✅ "Conferma la tua iscrizione a Pamasoft Newsletter"
- Evita parole trigger: FREE, CLICK HERE, URGENT, etc.

### 4. **Contenuto Email** ✅ **CRITICO**

#### Template Double Opt-In
1. **Settings → Email Templates → Double Opt-In Confirmation**
2. **Personalizza completamente**:
   - **Subject**: `Conferma la tua iscrizione a Pamasoft Newsletter`
   - **Preheader**: `Clicca il pulsante per confermare la tua iscrizione`
   - **Testo chiaro e professionale**
   - **Button CTA**: "Conferma Iscrizione" (non "CLICK HERE")

#### Best Practices Contenuto:
- ✅ **Testo/HTML ratio**: Almeno 30% testo, non solo immagini
- ✅ **Link formattati**: Usa testo descrittivo, non URL nudi
  - ❌ `https://app.mailbluster.com/confirm/xxxxx`
  - ✅ `Conferma la tua iscrizione`
- ✅ **Plain-text version**: Assicurati che MailBluster generi versione testo
- ✅ **Footer professionale**: Nome azienda, indirizzo, unsubscribe link
- ❌ **Evita**: Troppi link, immagini grandi, testo rosso/verde acceso
- ❌ **Evita**: Parole trigger: "FREE", "WIN", "URGENT", "ACT NOW"

### 5. **Warm-up del Dominio** ⚠️ **IMPORTANTE**
Se il dominio è nuovo o poco usato:
- Invia gradualmente le prime email:
  - Giorno 1-3: 10-20 email/giorno
  - Giorno 4-7: 50 email/giorno
  - Giorno 8-14: 100 email/giorno
  - Giorno 15+: 200+ email/giorno
- **Monitora bounce rate**: Se >5%, rallenta
- **Monitora spam complaints**: Se >0.1%, ferma e verifica

### 6. **Lista Pulita** ✅
- Rimuovi email bounce/invalide regolarmente
- Monitora spam complaints (obiettivo <0.1%)
- Mantieni tasso di bounce <2%
- Rimuovi email inattive dopo 6-12 mesi

### 7. **Configurazione MailBluster Template** ✅ **FONDAMENTALE**

#### Template Double Opt-In Ottimizzato:

**Subject Line:**
```
Conferma la tua iscrizione a Pamasoft Newsletter
```

**Preheader Text:**
```
Clicca il pulsante qui sotto per confermare la tua iscrizione e iniziare a ricevere aggiornamenti su cloud computing, AI e blockchain.
```

**Body Email:**
```
Ciao,

Grazie per esserti iscritto alla newsletter di Pamasoft!

Per completare l'iscrizione, clicca sul pulsante qui sotto:

[PULSANTE: "Conferma Iscrizione"]

Se il pulsante non funziona, copia e incolla questo link nel browser:
{{confirmation_link}}

Se non hai richiesto questa iscrizione, ignora questa email.

Cordiali saluti,
Il Team Pamasoft

---
Pamasoft Srl
Via E. Fermi, 75 - 51100 Pistoia, Italia
info@pamasoft.com | pamasoft.com
```

**Importante:**
- ✅ Usa variabile `{{confirmation_link}}` di MailBluster
- ✅ Button con stile professionale (colore brand, non rosso/verde acceso)
- ✅ Footer con informazioni azienda
- ✅ Link unsubscribe visibile
- ✅ Versione plain-text generata automaticamente

---

## 🔍 Verifica Configurazione

### Test SPF

```bash
dig TXT pamasoft.com | grep spf
```

**Output atteso:**
```
pamasoft.com. 3600 IN TXT "v=spf1 include:mailbluster.com ~all"
```

### Test DKIM

```bash
dig TXT mailbluster._domainkey.pamasoft.com
```

**Output atteso:**
```
mailbluster._domainkey.pamasoft.com. 3600 IN TXT "v=DKIM1; k=rsa; p=[chiave pubblica]"
```

### Test DMARC

```bash
dig TXT _dmarc.pamasoft.com
```

**Output atteso:**
```
_dmarc.pamasoft.com. 3600 IN TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@pamasoft.com"
```

### Mail-Tester

1. Vai su [mail-tester.com](https://www.mail-tester.com)
2. Invia email a `test-xxxxx@mail-tester.com`
3. Verifica score: **Dovrebbe essere 10/10**

---

## 📊 Monitoraggio Deliverability

In MailBluster Dashboard:

- **Deliverability Rate**: >95% ✅
- **Bounce Rate**: <2% ✅
- **Spam Complaints**: <0.1% ✅
- **Open Rate**: >20% (buono)

---

## 🚨 Troubleshooting

### Email ancora in spam?

1. **Verifica DNS propagati**
   ```bash
   dig TXT pamasoft.com
   dig TXT mailbluster._domainkey.pamasoft.com
   ```

2. **Controlla SPF include**
   - Deve includere `include:mailbluster.com`
   - Non deve avere `-all` (usa `~all` o `?all`)

3. **Warm-up del dominio**
   - Se dominio nuovo, invia gradualmente
   - Non inviare migliaia di email subito

4. **Contenuto email**
   - Evita parole trigger spam
   - Usa testo professionale
   - Evita troppi link

5. **Lista email**
   - Rimuovi email bounce
   - Rimuovi email invalide
   - Mantieni lista pulita

### DNS non si propaga?

1. Attendi fino a 48 ore (di solito 5-30 minuti)
2. Verifica TTL dei record (usa 3600)
3. Pulisci cache DNS locale
4. Controlla errori di sintassi nei record

### Dominio non verifica?

1. Controlla che tutti i record DNS siano corretti
2. Verifica che non ci siano record SPF duplicati
3. Controlla che il dominio non sia già verificato altrove
4. Contatta support MailBluster se necessario

---

## 📞 Supporto

- **MailBluster Support**: support@mailbluster.com
- **Documentazione**: https://help.mailbluster.com
- **DNS Help**: Contatta il tuo provider DNS (Cloudflare, AWS, etc.)

---

**Versione:** 1.0  
**Data:** Ottobre 2025  
**Autore:** Pamasoft Development Team

