/**
 * PAMASOFT - Contact Form Handler with CORS Support
 * Version: 2.0
 * Date: October 2025
 * 
 * Gestisce invio form senza problemi CORS usando Fetch API
 */

(function() {
    'use strict';
    
    // Endpoint
    const FORM_ENDPOINT = 'https://erp.pamasoft.com/send-email.jsp';
    const NEWSLETTER_ENDPOINT = 'https://erp.pamasoft.com/subscribe-newsletter.jsp';
    
    // reCAPTCHA v3 Site Key (da configurare)
    const RECAPTCHA_SITE_KEY = 'YOUR_RECAPTCHA_SITE_KEY';
    
    // ========================================
    // LANGUAGE DETECTION
    // ========================================
    function getCurrentLanguage() {
        // Prova a leggere dal tag html
        const htmlLang = document.documentElement.lang;
        if (htmlLang && (htmlLang === 'en' || htmlLang.startsWith('en-'))) {
            return 'en';
        }
        
        // Prova a leggere dal pathname
        if (window.location.pathname.startsWith('/en')) {
            return 'en';
        }
        
        // Default italiano
        return 'it';
    }
    
    // ========================================
    // TRANSLATIONS
    // ========================================
    const translations = {
        it: {
            connectionError: {
                title: 'Errore di connessione.',
                message: 'Si è verificato un problema durante l\'invio del messaggio. Per favore riprova o contattaci direttamente a <a href="mailto:info@pamasoft.com">info@pamasoft.com</a>.'
            },
            newsletterError: {
                title: 'Errore durante l\'iscrizione.',
                message: 'Si è verificato un problema. Riprova più tardi.'
            },
            validation: {
                invalidName: '• Il nome contiene caratteri non validi.\n',
                invalidLastName: '• Il cognome contiene caratteri non validi.\n',
                invalidEmail: '• L\'indirizzo email non è valido.\n',
                messageTooShort: '• Il messaggio deve contenere almeno 10 caratteri.\n',
                invalidPhone: '• Il numero di telefono non è valido.\n',
                privacyRequired: '• Devi accettare la Privacy Policy.\n',
                pleaseCorrect: 'Per favore, correggi i seguenti errori:\n\n'
            }
        },
        en: {
            connectionError: {
                title: 'Connection error.',
                message: 'A problem occurred while sending the message. Please try again or contact us directly at <a href="mailto:info@pamasoft.com">info@pamasoft.com</a>.'
            },
            newsletterError: {
                title: 'Error during subscription.',
                message: 'A problem occurred. Please try again later.'
            },
            validation: {
                invalidName: '• The name contains invalid characters.\n',
                invalidLastName: '• The last name contains invalid characters.\n',
                invalidEmail: '• The email address is not valid.\n',
                messageTooShort: '• The message must contain at least 10 characters.\n',
                invalidPhone: '• The phone number is not valid.\n',
                privacyRequired: '• You must accept the Privacy Policy.\n',
                pleaseCorrect: 'Please correct the following errors:\n\n'
            }
        }
    };
    
    function t(key) {
        const lang = getCurrentLanguage();
        const keys = key.split('.');
        let value = translations[lang];
        for (const k of keys) {
            value = value[k];
        }
        return value || key;
    }
    
    // ========================================
    // INIZIALIZZAZIONE
    // ========================================
    function init() {
        // Form Homepage
        const formHome = document.getElementById('contact-form-home');
        if (formHome) {
            setupForm(formHome, 'form-response-home', 'loading-home', FORM_ENDPOINT);
        }
        
        // Form Pagina Contatti
        const formPage = document.getElementById('contact-form-page');
        if (formPage) {
            setupForm(formPage, 'form-response-page', 'loading-page', FORM_ENDPOINT);
        }
        
        // Form Newsletter (Footer)
        const formNewsletter = document.getElementById('newsletter-form');
        if (formNewsletter) {
            console.log('[NEWSLETTER] Form newsletter trovato, setup in corso...');
            setupNewsletterForm(formNewsletter, 'newsletter-response', 'loading-newsletter', NEWSLETTER_ENDPOINT);
        } else {
            console.warn('[NEWSLETTER] Form newsletter NON trovato! ID: newsletter-form');
        }
        
        // Inizializza timestamp
        initTimestamp();
        
        console.log('Pamasoft Contact Form Handler Initialized ✓');
    }
    
    // ========================================
    // SETUP FORM
    // ========================================
    function setupForm(form, responseId, loadingId, endpoint) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validazione client-side
            if (!validateForm(form)) {
                return false;
            }
            
            // Invia il form
            submitForm(form, responseId, loadingId, endpoint);
        });
    }
    
    // ========================================
    // SETUP NEWSLETTER FORM
    // ========================================
    function setupNewsletterForm(form, responseId, loadingId, endpoint) {
        // Crea o aggiorna il campo lang nascosto
        let langField = form.querySelector('[name="lang"]');
        if (!langField) {
            langField = document.createElement('input');
            langField.type = 'hidden';
            langField.name = 'lang';
            form.appendChild(langField);
        }
        
        // Funzione per aggiornare il campo lang
        function updateLangField() {
            langField.value = getCurrentLanguage();
        }
        
        // Aggiorna immediatamente
        updateLangField();
        
        // Aggiorna quando cambia la lingua (se c'è un language switcher)
        const languageSwitcher = document.getElementById('language-switcher');
        if (languageSwitcher) {
            languageSwitcher.addEventListener('change', updateLangField);
        }
        
        // Aggiorna anche quando cambia il pathname (navigazione)
        let lastPathname = window.location.pathname;
        const checkPathname = setInterval(function() {
            if (window.location.pathname !== lastPathname) {
                lastPathname = window.location.pathname;
                updateLangField();
            }
        }, 500);
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('[NEWSLETTER] Submit form newsletter intercettato');
            
            // Aggiorna sempre il campo lang prima dell'invio
            updateLangField();
            console.log('[NEWSLETTER] Lang field aggiornato:', langField.value);
            
            // Validazione newsletter
            if (!validateNewsletterForm(form)) {
                console.warn('[NEWSLETTER] Validazione form fallita');
                return false;
            }
            
            console.log('[NEWSLETTER] Validazione OK, invio form...');
            // Invia il form
            submitForm(form, responseId, loadingId, endpoint, true);
        });
    }
    
    // ========================================
    // OTTIENI TOKEN reCAPTCHA v3
    // ========================================
    function getRecaptchaToken(action) {
        return new Promise((resolve, reject) => {
            // Se reCAPTCHA non è configurato, procedi senza token
            if (!window.grecaptcha || RECAPTCHA_SITE_KEY === 'YOUR_RECAPTCHA_SITE_KEY') {
                resolve(null);
                return;
            }
            
            window.grecaptcha.ready(function() {
                window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: action })
                    .then(function(token) {
                        resolve(token);
                    })
                    .catch(function(error) {
                        console.warn('reCAPTCHA error:', error);
                        resolve(null); // Continua anche se reCAPTCHA fallisce
                    });
            });
        });
    }
    
    // ========================================
    // INVIO FORM CON FETCH
    // ========================================
    function submitForm(form, responseId, loadingId, endpoint, isNewsletter) {
        const responseDiv = document.getElementById(responseId);
        const loadingSpinner = document.getElementById(loadingId);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        console.log('[FORM] Inizio invio form', { isNewsletter, endpoint, responseId });
        
        // Mostra loading
        if (loadingSpinner) loadingSpinner.style.display = 'inline-block';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('submitting');
        }
        
        // Ottieni token reCAPTCHA (solo per form contatto, non newsletter)
        const action = isNewsletter ? 'newsletter' : 'contact';
        getRecaptchaToken(action).then(function(recaptchaToken) {
            // Prepara form data
            const formData = new FormData(form);
            
            // Aggiungi token reCAPTCHA se disponibile
            if (recaptchaToken) {
                formData.append('recaptcha_token', recaptchaToken);
                console.log('[FORM] Token reCAPTCHA aggiunto');
            }
            
            // Converti in URL-encoded (più compatibile)
            const urlEncodedData = new URLSearchParams();
            for (const [key, value] of formData) {
                urlEncodedData.append(key, value);
            }
            
            console.log('[FORM] Dati form preparati:', {
                endpoint: endpoint,
                dataKeys: Array.from(formData.keys()),
                dataSize: urlEncodedData.toString().length
            });
            
            // Invia richiesta
            console.log('[FORM] Invio richiesta fetch a:', endpoint);
            return fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: urlEncodedData.toString(),
                mode: 'cors',
                credentials: 'omit' // Non invia cookies
            })
            .then(response => {
                console.log('[FORM] Risposta ricevuta:', {
                    status: response.status,
                    statusText: response.statusText,
                    ok: response.ok,
                    headers: Object.fromEntries(response.headers.entries())
                });
                
                if (!response.ok) {
                    console.error('[FORM] Errore HTTP:', response.status, response.statusText);
                    throw new Error('HTTP error! status: ' + response.status);
                }
                return response.text();
            })
            .then(html => {
                console.log('[FORM] HTML risposta ricevuto:', {
                    length: html.length,
                    preview: html.substring(0, 200) + '...'
                });
                
                // Mostra risposta
                if (responseDiv) {
                // Controlla se la risposta contiene messaggi di errore in italiano e traducili
                let processedHtml = html;
                const lang = getCurrentLanguage();
                
                if (lang === 'en') {
                    // Traduci messaggi di errore comuni dal server
                    processedHtml = processedHtml
                        // Errori newsletter - titoli (con strong tag)
                        .replace(/<strong>Errore durante l'iscrizione\.<\/strong>/gi, '<strong>Error during subscription.</strong>')
                        .replace(/<strong>Errore durante l'iscrizione<\/strong>/gi, '<strong>Error during subscription</strong>')
                        .replace(/Errore durante l'iscrizione\./gi, 'Error during subscription.')
                        .replace(/Errore durante l'iscrizione/gi, 'Error during subscription')
                        // Errori newsletter - messaggi
                        .replace(/Si è verificato un problema\. Riprova più tardi\./gi, 'A problem occurred. Please try again later.')
                        .replace(/Si è verificato un problema\./gi, 'A problem occurred.')
                        .replace(/Si è verificato un problema/gi, 'A problem occurred')
                        .replace(/Riprova più tardi\./gi, 'Please try again later.')
                        .replace(/Riprova più tardi/gi, 'Please try again later')
                        // Errori connessione
                        .replace(/<strong>Errore di connessione\.<\/strong>/gi, '<strong>Connection error.</strong>')
                        .replace(/Errore di connessione\./gi, 'Connection error.')
                        .replace(/Errore di connessione/gi, 'Connection error')
                        .replace(/Non è stato possibile contattare il servizio di newsletter\. Riprova più tardi\./gi, 'Unable to contact the newsletter service. Please try again later.')
                        .replace(/Non è stato possibile contattare/gi, 'Unable to contact')
                        // Errori validazione - titoli
                        .replace(/<strong>Email richiesta\.<\/strong>/gi, '<strong>Email required.</strong>')
                        .replace(/<strong>Email non valida\.<\/strong>/gi, '<strong>Invalid email.</strong>')
                        .replace(/<strong>Privacy Policy richiesta\.<\/strong>/gi, '<strong>Privacy Policy required.</strong>')
                        .replace(/<strong>Errore di validazione\.<\/strong>/gi, '<strong>Validation error.</strong>')
                        .replace(/<strong>Troppe richieste\.<\/strong>/gi, '<strong>Too many requests.</strong>')
                        .replace(/<strong>Errore interno\.<\/strong>/gi, '<strong>Internal error.</strong>')
                        .replace(/<strong>Errore imprevisto\.<\/strong>/gi, '<strong>Unexpected error.</strong>')
                        // Errori validazione - messaggi
                        .replace(/Email richiesta\./gi, 'Email required.')
                        .replace(/Email non valida\./gi, 'Invalid email.')
                        .replace(/Inserisci un indirizzo email valido\./gi, 'Enter a valid email address.')
                        .replace(/Inserisci un indirizzo email corretto\./gi, 'Enter a correct email address.')
                        .replace(/Privacy Policy richiesta\./gi, 'Privacy Policy required.')
                        .replace(/Devi accettare la Privacy Policy per iscriverti\./gi, 'You must accept the Privacy Policy to subscribe.')
                        .replace(/Gli indirizzi email temporanei non sono accettati\./gi, 'Temporary email addresses are not accepted.')
                        .replace(/Hai già effettuato diverse iscrizioni\. Riprova più tardi\./gi, 'You have already made several subscriptions. Please try again later.')
                        // Messaggi di successo
                        .replace(/<strong>Iscrizione quasi completata!<\/strong>/gi, '<strong>Subscription almost complete!</strong>')
                        .replace(/Iscrizione quasi completata!/gi, 'Subscription almost complete!')
                        .replace(/Ti abbiamo inviato un'email di conferma a/gi, 'We have sent you a confirmation email to')
                        .replace(/Clicca sul link nell'email per confermare la tua iscrizione alla newsletter\./gi, 'Click the link in the email to confirm your newsletter subscription.')
                        .replace(/Iscrizione completata con successo/gi, 'Subscription completed successfully')
                        .replace(/completata con successo/gi, 'completed successfully')
                        .replace(/Grazie per esserti iscritto/gi, 'Thank you for subscribing')
                        .replace(/Grazie per la tua iscrizione/gi, 'Thank you for your subscription')
                        // Email già registrata
                        .replace(/<strong>Email già registrata\.<\/strong>/gi, '<strong>Email already registered.</strong>')
                        .replace(/Email già registrata\./gi, 'Email already registered.')
                        .replace(/Questo indirizzo è già iscritto alla nostra newsletter\./gi, 'This address is already subscribed to our newsletter.')
                        // Altri errori
                        .replace(/Si è verificato un errore durante l'elaborazione della risposta\./gi, 'An error occurred while processing the response.')
                        .replace(/Si è verificato un errore\. Contattaci direttamente a/gi, 'An error occurred. Contact us directly at')
                        .replace(/Si è verificato un problema durante l'invio del messaggio\./gi, 'A problem occurred while sending the message.')
                        .replace(/Per favore riprova o contattaci direttamente/gi, 'Please try again or contact us directly')
                        // Altri messaggi generici
                        .replace(/Email già iscritta/gi, 'Email already subscribed')
                        .replace(/L'email non è valida/gi, 'The email is not valid')
                        .replace(/Campo obbligatorio/gi, 'Required field')
                        .replace(/Campo non valido/gi, 'Invalid field');
                }
                
                    console.log('[FORM] Aggiornamento responseDiv con HTML processato');
                    responseDiv.innerHTML = processedHtml;
                    responseDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    
                    // Log del contenuto finale mostrato
                    console.log('[FORM] Contenuto finale mostrato:', {
                        hasSuccess: processedHtml.toLowerCase().includes('success'),
                        hasError: processedHtml.toLowerCase().includes('error'),
                        htmlLength: processedHtml.length
                    });
                } else {
                    console.warn('[FORM] responseDiv non trovato! ID:', responseId);
                }
                
                // Se successo, resetta form
                if (html.includes('success') || html.toLowerCase().includes('successo') || html.toLowerCase().includes('completata')) {
                    setTimeout(() => {
                        form.reset();
                        if (!isNewsletter) {
                            initTimestamp();
                        }
                    }, isNewsletter ? 500 : 2000); // Newsletter reset più veloce
                }
            })
            .catch(error => {
                console.error('[FORM] Errore durante invio form:', {
                    error: error,
                    message: error.message,
                    stack: error.stack,
                    isNewsletter: isNewsletter,
                    endpoint: endpoint
                });
                
                if (responseDiv) {
                    const errorTitle = isNewsletter ? t('newsletterError.title') : t('connectionError.title');
                    const errorMessage = isNewsletter ? t('newsletterError.message') : t('connectionError.message');
                    
                    console.log('[FORM] Mostro messaggio errore all\'utente:', { errorTitle, errorMessage });
                    
                    responseDiv.innerHTML = 
                        '<div class="alert-notification error">' +
                        '<i class="fas fa-exclamation-triangle"></i> ' +
                        '<strong>' + errorTitle + '</strong><br>' +
                        errorMessage +
                        '</div>';
                } else {
                    console.error('[FORM] responseDiv non trovato! ID:', responseId);
                }
            })
            .finally(() => {
                // Nascondi loading
                if (loadingSpinner) loadingSpinner.style.display = 'none';
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('submitting');
                }
            });
        }); // Fine promise reCAPTCHA
    }
    
    // ========================================
    // VALIDAZIONE FORM
    // ========================================
    function validateForm(form) {
        let isValid = true;
        let errorMessage = '';
        
        // Recupera campi
        const firstName = form.querySelector('[name="first_name"]');
        const lastName = form.querySelector('[name="last_name"]');
        const email = form.querySelector('[name="email"]');
        const message = form.querySelector('[name="message"]');
        const privacy = form.querySelector('[name="privacy_accept"]');
        const phone = form.querySelector('[name="phone_number"]');
        
        // Valida nome
        if (firstName && !validateName(firstName.value)) {
            errorMessage += t('validation.invalidName');
            firstName.classList.add('is-invalid');
            isValid = false;
        } else if (firstName) {
            firstName.classList.remove('is-invalid');
        }
        
        // Valida cognome
        if (lastName && !validateName(lastName.value)) {
            errorMessage += t('validation.invalidLastName');
            lastName.classList.add('is-invalid');
            isValid = false;
        } else if (lastName) {
            lastName.classList.remove('is-invalid');
        }
        
        // Valida email
        if (email && !validateEmail(email.value)) {
            errorMessage += t('validation.invalidEmail');
            email.classList.add('is-invalid');
            isValid = false;
        } else if (email) {
            email.classList.remove('is-invalid');
        }
        
        // Valida messaggio
        if (message && message.value.length < 10) {
            errorMessage += t('validation.messageTooShort');
            message.classList.add('is-invalid');
            isValid = false;
        } else if (message) {
            message.classList.remove('is-invalid');
        }
        
        // Valida telefono (se presente)
        if (phone && phone.value && !validatePhone(phone.value)) {
            errorMessage += t('validation.invalidPhone');
            phone.classList.add('is-invalid');
            isValid = false;
        } else if (phone) {
            phone.classList.remove('is-invalid');
        }
        
        // Valida privacy
        if (privacy && !privacy.checked) {
            errorMessage += t('validation.privacyRequired');
            isValid = false;
        }
        
        // Mostra errori
        if (!isValid) {
            alert(t('validation.pleaseCorrect') + errorMessage);
        }
        
        return isValid;
    }
    
    // ========================================
    // VALIDATORI
    // ========================================
    function validateEmail(email) {
        const re = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;
        return re.test(email);
    }
    
    function validateName(name) {
        const re = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/;
        return re.test(name);
    }
    
    function validatePhone(phone) {
        const re = /^[\d\s\+\-\(\)]{5,20}$/;
        return re.test(phone);
    }
    
    // ========================================
    // VALIDAZIONE NEWSLETTER FORM
    // ========================================
    function validateNewsletterForm(form) {
        let isValid = true;
        let errorMessage = '';
        
        const email = form.querySelector('[name="email"]');
        const privacy = form.querySelector('[name="privacy_accept"]');
        
        // Valida email
        if (email && !validateEmail(email.value)) {
            errorMessage += t('validation.invalidEmail');
            email.classList.add('is-invalid');
            isValid = false;
        } else if (email) {
            email.classList.remove('is-invalid');
        }
        
        // Valida privacy
        if (privacy && !privacy.checked) {
            errorMessage += t('validation.privacyRequired');
            isValid = false;
        }
        
        // Mostra errori
        if (!isValid) {
            alert(t('validation.pleaseCorrect') + errorMessage);
        }
        
        return isValid;
    }
    
    // ========================================
    // TIMESTAMP INITIALIZATION
    // ========================================
    function initTimestamp() {
        const timestampHome = document.getElementById('form_timestamp_home');
        if (timestampHome) {
            timestampHome.value = Date.now();
        }
        
        const timestampPage = document.getElementById('form_timestamp_page');
        if (timestampPage) {
            timestampPage.value = Date.now();
        }
    }
    
    // ========================================
    // AUTO-START
    // ========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();

