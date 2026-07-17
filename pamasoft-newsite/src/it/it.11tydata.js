function normalizePathStem(stem) {
  return stem.replace(/^\/it/, "") || "/";
}

function ensureTrailingSlash(path) {
  if (path === "/") {
    return path;
  }
  return path.endsWith("/") ? path : `${path}/`;
}

module.exports = {
  lang: "it",
  locale: "it",
  eleventyComputed: {
    permalink: (data) => {
      if (data.permalink) {
        return data.permalink;
      }

      const stem = normalizePathStem(data.page.filePathStem);
      if (stem === "/" || stem === "/index") {
        return "/";
      }

      return ensureTrailingSlash(stem);
    }
  }
};

