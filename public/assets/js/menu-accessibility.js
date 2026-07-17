/**
 * Menu Accessibility Enhancement
 * Gestione completa accessibilità menu con ARIA, tastiera e outside click
 */

(function() {
    'use strict';

    // Elementi del menu
    const menuBar = document.querySelector('.menu-bar');
    const closeMenuBar = document.querySelector('.close-menu-bar');
    const navbarWrapper = document.querySelector('.navbar-wrapper');
    const dropdownItems = document.querySelectorAll('.dropdown-menu-item');

    // Mobile menu toggle
    if (menuBar && navbarWrapper) {
        menuBar.addEventListener('click', function() {
            navbarWrapper.classList.add('active');
            menuBar.setAttribute('aria-expanded', 'true');
            // Focus trap: sposta focus sul primo elemento del menu
            const firstLink = navbarWrapper.querySelector('a');
            if (firstLink) firstLink.focus();
        });
    }

    if (closeMenuBar && navbarWrapper) {
        closeMenuBar.addEventListener('click', function() {
            navbarWrapper.classList.remove('active');
            if (menuBar) menuBar.setAttribute('aria-expanded', 'false');
            // Riporta focus al pulsante menu
            if (menuBar) menuBar.focus();
        });
    }

    // Outside click per chiudere il menu mobile
    document.addEventListener('click', function(e) {
        if (navbarWrapper && navbarWrapper.classList.contains('active')) {
            if (!navbarWrapper.contains(e.target) && !menuBar.contains(e.target)) {
                navbarWrapper.classList.remove('active');
                if (menuBar) menuBar.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // ESC key per chiudere il menu mobile
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navbarWrapper && navbarWrapper.classList.contains('active')) {
            navbarWrapper.classList.remove('active');
            if (menuBar) {
                menuBar.setAttribute('aria-expanded', 'false');
                menuBar.focus();
            }
        }
    });

    // Dropdown menu accessibility
    dropdownItems.forEach(function(item) {
        const link = item.querySelector('a[aria-haspopup]');
        const dropdownIcon = item.querySelector('.dropdown-menu-item-icon');
        const dropdown = item.querySelector('.dropdown-menu');

        if (!link || !dropdown) return;

        // Toggle dropdown on click
        const toggleDropdown = function(e) {
            e.preventDefault();
            const isExpanded = link.getAttribute('aria-expanded') === 'true';
            
            // Chiudi tutti gli altri dropdown
            dropdownItems.forEach(function(otherItem) {
                const otherLink = otherItem.querySelector('a[aria-haspopup]');
                const otherDropdown = otherItem.querySelector('.dropdown-menu');
                if (otherLink && otherDropdown && otherItem !== item) {
                    otherLink.setAttribute('aria-expanded', 'false');
                    otherDropdown.classList.remove('active');
                }
            });

            // Toggle corrente
            link.setAttribute('aria-expanded', !isExpanded);
            dropdown.classList.toggle('active');
        };

        if (dropdownIcon) {
            dropdownIcon.addEventListener('click', toggleDropdown);
        }

        // Gestione tastiera
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                toggleDropdown(e);
            }
        });

        // Chiudi dropdown con ESC
        dropdown.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                link.setAttribute('aria-expanded', 'false');
                dropdown.classList.remove('active');
                link.focus();
            }
        });
    });

    // Outside click per chiudere i dropdown
    document.addEventListener('click', function(e) {
        dropdownItems.forEach(function(item) {
            const link = item.querySelector('a[aria-haspopup]');
            const dropdown = item.querySelector('.dropdown-menu');
            
            if (link && dropdown && !item.contains(e.target)) {
                link.setAttribute('aria-expanded', 'false');
                dropdown.classList.remove('active');
            }
        });
    });

})();
