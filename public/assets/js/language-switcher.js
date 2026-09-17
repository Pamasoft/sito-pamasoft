(function () {
  'use strict';

  /** Must stay in sync with src/i18n/utils.ts IT_TO_EN map */
  var IT_TO_EN = {
    '/chi-siamo/': '/en/about/',
    '/contatti/': '/en/contact/',
    '/servizi/': '/en/services/',
    '/servizi/cloud-computing/': '/en/services/cloud-computing/',
    '/servizi/intelligenza-artificiale/': '/en/services/artificial-intelligence/',
    '/servizi/blockchain/': '/en/services/blockchain/',
    '/servizi/cybersecurity/': '/en/services/cybersecurity/',
    '/servizi/sviluppo-applicazioni-web/': '/en/services/web-application-development/',
    '/termini-servizio/': '/en/terms-of-service/',
  };

  var EN_TO_IT = {};
  Object.keys(IT_TO_EN).forEach(function (itPath) {
    EN_TO_IT[IT_TO_EN[itPath]] = itPath;
  });

  function normalizePath(pathname) {
    if (!pathname || pathname === '') return '/';
    if (!pathname.startsWith('/')) pathname = '/' + pathname;
    if (!pathname.endsWith('/')) pathname = pathname + '/';
    return pathname;
  }

  function initLanguageSwitcher() {
    var select = document.getElementById('language-switcher');
    if (!select) return;

    var defaultLang = select.getAttribute('data-default-lang') || 'it';
    var enPrefixRaw = select.getAttribute('data-prefix-en') || '/en';
    var enPrefix = normalizePrefix(enPrefixRaw);
    var path = window.location.pathname || '/';
    var isEnglishPath =
      enPrefix &&
      (path === enPrefix || path === enPrefix + '/' || path.startsWith(enPrefix + '/'));

    var currentLang = select.getAttribute('data-current-lang');
    if (!currentLang) {
      currentLang = isEnglishPath ? 'en' : defaultLang;
    }

    select.value = currentLang;

    try {
      var savedLang = localStorage.getItem('pamasoftPreferredLanguage');
      if (savedLang && (savedLang === 'it' || savedLang === 'en')) {
        if ((savedLang === 'en' && isEnglishPath) || (savedLang === 'it' && !isEnglishPath)) {
          select.value = savedLang;
          currentLang = savedLang;
        }
      }
    } catch (error) {
      /* ignore */
    }

    select.addEventListener('change', function (event) {
      var targetLang = event.target.value;
      if (targetLang === currentLang) return;

      try {
        localStorage.setItem('pamasoftPreferredLanguage', targetLang);
      } catch (error) {
        /* ignore */
      }

      window.location.href = buildDestinationPath(path, targetLang, enPrefix);
    });

    select.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  }

  function buildDestinationPath(pathname, targetLang, enPrefix) {
    var normalized = normalizePath(pathname);

    if (targetLang === 'en') {
      if (normalized === '/') return ensureTrailingSlash(enPrefix || '/en');
      if (IT_TO_EN[normalized]) return IT_TO_EN[normalized];
      if (
        enPrefix &&
        (normalized === enPrefix + '/' || normalized.startsWith(enPrefix + '/'))
      ) {
        return normalized;
      }
      return normalizeJoin(enPrefix || '/en', normalized);
    }

    // Italian
    if (EN_TO_IT[normalized]) return EN_TO_IT[normalized];
    if (enPrefix && (normalized === enPrefix + '/' || normalized === ensureTrailingSlash(enPrefix))) {
      return '/';
    }
    if (enPrefix && normalized.startsWith(enPrefix + '/')) {
      var stripped = normalized.slice(enPrefix.length);
      if (!stripped || stripped === '/') return '/';
      return normalizePath(stripped);
    }
    return normalized;
  }

  function normalizePrefix(prefix) {
    if (!prefix) return '';
    if (!prefix.startsWith('/')) prefix = '/' + prefix;
    if (prefix.length > 1 && prefix.endsWith('/')) prefix = prefix.slice(0, -1);
    return prefix;
  }

  function ensureTrailingSlash(value) {
    return value.endsWith('/') ? value : value + '/';
  }

  function normalizeJoin(prefix, pathname) {
    var normalizedPrefix = prefix.endsWith('/') ? prefix.slice(0, -1) : prefix;
    var normalizedPath = pathname.startsWith('/') ? pathname : '/' + pathname;
    return normalizePath(normalizedPrefix + normalizedPath);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
  } else {
    initLanguageSwitcher();
  }
})();
