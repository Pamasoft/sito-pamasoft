(function() {
  'use strict';
  
  function initLanguageSwitcher() {
    const select = document.getElementById("language-switcher");
    if (!select) {
      console.warn("Language switcher element not found");
      return;
    }

    const defaultLang = select.getAttribute("data-default-lang") || "it";
    const enPrefixRaw = select.getAttribute("data-prefix-en") || "/en";
    const enPrefix = normalizePrefix(enPrefixRaw);
    const path = window.location.pathname || "/";
    const isEnglishPath =
      enPrefix &&
      (path === enPrefix || path === enPrefix + "/" || path.startsWith(enPrefix + "/"));

    let currentLang = select.getAttribute("data-current-lang");
    if (!currentLang) {
      currentLang = isEnglishPath ? "en" : defaultLang;
    }

    // Set initial value
    select.value = currentLang;
    
    // Try to restore from localStorage if available
    try {
      const savedLang = localStorage.getItem("pamasoftPreferredLanguage");
      if (savedLang && (savedLang === "it" || savedLang === "en")) {
        // Only use saved language if it matches current path
        if ((savedLang === "en" && isEnglishPath) || (savedLang === "it" && !isEnglishPath)) {
          select.value = savedLang;
          currentLang = savedLang;
        }
      }
    } catch (error) {
      console.warn("Unable to read language preference:", error);
    }

    // Add change event listener
    select.addEventListener("change", function(event) {
      const targetLang = event.target.value;
      if (targetLang === currentLang) {
        return;
      }

      console.log("Language switch requested:", targetLang);

      try {
        localStorage.setItem("pamasoftPreferredLanguage", targetLang);
      } catch (error) {
        console.warn("Unable to persist language preference:", error);
      }

      const destination = buildDestinationPath(path, targetLang, enPrefix);
      console.log("Redirecting to:", destination);
      window.location.href = destination;
    });

    // Add click event for better mobile support
    select.addEventListener("click", function(event) {
      event.stopPropagation();
    });

    // Ensure select is visible and interactive
    select.style.display = "block";
    select.style.visibility = "visible";
    select.style.opacity = "1";
    
    console.log("Language switcher initialized:", {
      currentLang: currentLang,
      path: path,
      enPrefix: enPrefix
    });
  }

  function buildDestinationPath(pathname, targetLang, enPrefix) {
    // Normalizza il pathname
    if (!pathname || pathname === "") {
      pathname = "/";
    }
    
    if (targetLang === "en") {
      // Target: inglese
      if (!enPrefix) {
        return pathname;
      }
      
      // Se già in inglese, non cambiare
      if (pathname === enPrefix || pathname === enPrefix + "/" || pathname.startsWith(enPrefix + "/")) {
        return pathname;
      }
      
      // Se è la homepage italiana, vai alla homepage inglese
      if (pathname === "/" || pathname === "") {
        return ensureTrailingSlash(enPrefix);
      }
      
      // Aggiungi prefisso /en/ al path italiano
      return normalizeJoin(enPrefix, pathname);
    }

    // Target: italiano (rimuovi /en/)
    if (enPrefix && (pathname === enPrefix || pathname === enPrefix + "/" || pathname.startsWith(enPrefix + "/"))) {
      // Rimuovi il prefisso /en/
      let stripped = pathname.slice(enPrefix.length);
      
      // Se dopo la rimozione è vuoto o solo "/", torna alla homepage italiana
      if (!stripped || stripped === "" || stripped === "/") {
        return "/";
      }
      
      // Assicura che inizi con /
      if (!stripped.startsWith("/")) {
        stripped = "/" + stripped;
      }
      
      return stripped;
    }

    // Se non c'è prefisso /en/, è già italiano
    return pathname || "/";
  }

  function normalizePrefix(prefix) {
    if (!prefix) {
      return "";
    }
    if (!prefix.startsWith("/")) {
      prefix = "/" + prefix;
    }
    if (prefix.length > 1 && prefix.endsWith("/")) {
      prefix = prefix.slice(0, -1);
    }
    return prefix;
  }

  function ensureTrailingSlash(value) {
    return value.endsWith("/") ? value : value + "/";
  }

  function normalizeJoin(prefix, pathname) {
    const normalizedPrefix = prefix.endsWith("/") ? prefix.slice(0, -1) : prefix;
    const normalizedPath = pathname.startsWith("/") ? pathname : "/" + pathname;
    return normalizedPrefix + normalizedPath;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
  } else {
    // DOM is already ready
    initLanguageSwitcher();
  }
})();

