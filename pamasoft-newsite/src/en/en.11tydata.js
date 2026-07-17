const { locales, defaultLocale } = require("../_data/site");

function ensureLeadingSlash(path) {
  return path.startsWith("/") ? path : `/${path}`;
}

function ensureTrailingSlash(path) {
  return path.endsWith("/") ? path : `${path}/`;
}

module.exports = {
  lang: "en",
  locale: "en",
  eleventyComputed: {
    permalink: (data) => {
      if (data.permalink) {
        return data.permalink;
      }

      const localeConfig = locales.en || {};
      const prefix = localeConfig.pathPrefix || "/en";
      const stem = data.page.filePathStem.replace(/^\/en/, "");

      if (!stem || stem === "" || stem === "/index") {
        return ensureTrailingSlash(prefix);
      }

      return ensureTrailingSlash(`${ensureLeadingSlash(prefix.replace(/^\//, ""))}${stem}`);
    }
  }
};


