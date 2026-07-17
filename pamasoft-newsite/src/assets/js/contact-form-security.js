/**
 * PAMASOFT - Contact Form Security & Enhancement
 * Version: 1.0
 * Date: October 2025
 * 
 * Funzionalità:
 * - Timestamp per controllo velocità compilazione
 * - Validazione client-side
 * - Gestione HTMX eventi
 */

(function() {
    'use strict';
    
    // ========================================
    // INIZIALIZZAZIONE TIMESTAMP
    // ========================================
    function initFormTimestamp() {
        // Form Homepage
        const timestampHome = document.getElementById('form_timestamp_home');
        if (timestampHome) {
            timestampHome.value = Date.now();
        }
        
        // Form Pagina Contatti
        const timestampPage = document.getElementById('form_timestamp_page');
        if (timestampPage) {
            timestampPage.value = Date.now();
        }
    }
    
    // Inizializza al caricamento pagina
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFormTimestamp);
    } else {
        initFormTimestamp();
    }
    
    // ========================================
    // VALIDAZIONE CLIENT-SIDE AVANZATA
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
        // Permette numeri, spazi, +, -, (, )
        const re = /^[\d\s\+\-\(\)]{5,20}$/;
        return re.test(phone);
    }
    
    // ========================================
    // VALIDAZIONE FORM PRIMA DELL'INVIO
    // ========================================
    function validateForm(formId) {
        const form = document.getElementById(formId);
        if (!form) return true;
        
        let isValid = true;
        let errorMessage = '';
        
        // Recupera campi
        const firstName = form.querySelector('[name="first_name"]');
        const lastName = form.querySelector('[name="last_name"]');
        const email = form.querySelector('[name="email"]');
        const message = form.querySelector('[name="message"]');
        const privacy = form.querySelector('[name="privacy_accept"]');
        
        // Valida nome
        if (firstName && !validateName(firstName.value)) {
            errorMessage += '• Il nome contiene caratteri non validi.\n';
            firstName.classList.add('is-invalid');
            isValid = false;
        } else if (firstName) {
            firstName.classList.remove('is-invalid');
        }
        
        // Valida cognome
        if (lastName && !validateName(lastName.value)) {
            errorMessage += '• Il cognome contiene caratteri non validi.\n';
            lastName.classList.add('is-invalid');
            isValid = false;
        } else if (lastName) {
            lastName.classList.remove('is-invalid');
        }
        
        // Valida email
        if (email && !validateEmail(email.value)) {
            errorMessage += '• L\'indirizzo email non è valido.\n';
            email.classList.add('is-invalid');
            isValid = false;
        } else if (email) {
            email.classList.remove('is-invalid');
        }
        
        // Valida messaggio (min 10 caratteri)
        if (message && message.value.length < 10) {
            errorMessage += '• Il messaggio deve contenere almeno 10 caratteri.\n';
            message.classList.add('is-invalid');
            isValid = false;
        } else if (message) {
            message.classList.remove('is-invalid');
        }
        
        // Valida telefono (se presente)
        const phone = form.querySelector('[name="phone_number"]');
        if (phone && phone.value && !validatePhone(phone.value)) {
            errorMessage += '• Il numero di telefono non è valido.\n';
            phone.classList.add('is-invalid');
            isValid = false;
        } else if (phone) {
            phone.classList.remove('is-invalid');
        }
        
        // Valida privacy
        if (privacy && !privacy.checked) {
            errorMessage += '• Devi accettare la Privacy Policy.\n';
            isValid = false;
        }
        
        // Mostra errori se presenti
        if (!isValid) {
            alert('Per favore, correggi i seguenti errori:\n\n' + errorMessage);
        }
        
        return isValid;
    }
    
    // ========================================
    // GESTIONE EVENTI HTMX
    // ========================================
    
    // Prima dell'invio
    document.body.addEventListener('htmx:beforeRequest', function(evt) {
        const formId = evt.detail.elt.id;
        
        // Validazione client-side
        if (!validateForm(formId)) {
            evt.preventDefault();
            return false;
        }
        
        // Disabilita il pulsante di invio
        const submitBtn = evt.detail.elt.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('submitting');
        }
    });
    
    // Dopo la risposta
    document.body.addEventListener('htmx:afterRequest', function(evt) {
        const formId = evt.detail.elt.id;
        
        // Riabilita il pulsante
        const submitBtn = evt.detail.elt.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('submitting');
        }
        
        // Se successo, resetta il timestamp
        if (evt.detail.successful) {
            const timestampField = evt.detail.elt.querySelector('[name="form_timestamp"]');
            if (timestampField) {
                timestampField.value = Date.now();
            }
            
            // Scroll to response
            const responseDiv = document.getElementById(
                formId === 'contact-form-home' ? 'form-response-home' : 'form-response-page'
            );
            if (responseDiv) {
                responseDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    });
    
    // In caso di errore
    document.body.addEventListener('htmx:responseError', function(evt) {
        console.error('Form submission error:', evt.detail);
        
        const formId = evt.detail.elt.id;
        const responseId = formId === 'contact-form-home' ? 'form-response-home' : 'form-response-page';
        const responseDiv = document.getElementById(responseId);
        
        if (responseDiv) {
            responseDiv.innerHTML = 
                '<div class="alert-notification error">' +
                '<i class="fas fa-exclamation-triangle"></i> ' +
                '<strong>Errore di connessione.</strong><br>' +
                'Verifica la tua connessione internet e riprova.' +
                '</div>';
        }
        
        // Riabilita il pulsante
        const submitBtn = evt.detail.elt.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('submitting');
        }
    });
    
    // ========================================
    // SANITIZZAZIONE INPUT IN TEMPO REALE
    // ========================================
    function sanitizeInput(input) {
        // Rimuove script tags
        input.value = input.value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        
        // Limita caratteri consecutivi identici
        input.value = input.value.replace(/(.)\1{4,}/g, '$1$1$1');
    }
    
    // Applica sanitizzazione su tutti i campi di testo
    document.querySelectorAll('input[type="text"], input[type="email"], textarea').forEach(function(input) {
        input.addEventListener('blur', function() {
            sanitizeInput(this);
        });
    });
    
    // ========================================
    // CONTATORE CARATTERI PER MESSAGGIO
    // ========================================
    const messageFields = document.querySelectorAll('textarea[name="message"]');
    messageFields.forEach(function(textarea) {
        const maxLength = 5000;
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.cssText = 'text-align: right; font-size: 12px; color: #666; margin-top: 5px;';
        textarea.parentNode.appendChild(counter);
        
        function updateCounter() {
            const remaining = maxLength - textarea.value.length;
            counter.textContent = remaining + ' caratteri rimanenti';
            
            if (remaining < 100) {
                counter.style.color = '#dc3545';
            } else if (remaining < 500) {
                counter.style.color = '#ffc107';
            } else {
                counter.style.color = '#666';
            }
        }
        
        textarea.addEventListener('input', updateCounter);
        updateCounter();
    });
    
    // ========================================
    // AUTO-HIDE SUCCESS MESSAGE
    // ========================================
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && node.classList && node.classList.contains('success')) {
                    // Nascondi dopo 10 secondi
                    setTimeout(function() {
                        node.style.transition = 'opacity 0.5s';
                        node.style.opacity = '0';
                        setTimeout(function() {
                            node.remove();
                        }, 500);
                    }, 10000);
                }
            });
        });
    });
    
    // Osserva i div di risposta
    ['form-response-home', 'form-response-page'].forEach(function(id) {
        const el = document.getElementById(id);
        if (el) {
            observer.observe(el, { childList: true });
        }
    });
    
    console.log('Pamasoft Contact Form Security Initialized ✓');
    
})();


