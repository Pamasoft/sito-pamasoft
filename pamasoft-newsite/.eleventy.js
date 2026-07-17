module.exports = function(eleventyConfig) {
  // Copy assets folder
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/loghi pamasoft");
  eleventyConfig.addPassthroughCopy("src/sitemap.xml");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  
  // Watch for changes in CSS and JS files
  eleventyConfig.addWatchTarget("src/assets/");
  
  // Enable hot reload
  eleventyConfig.setServerOptions({
    showAllHosts: true,
  });

  // Add date filter for blog posts
  eleventyConfig.addFilter("dateFormat", function(date) {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      locale: 'it-IT'
    };
    return new Date(date).toLocaleDateString('it-IT', options);
  });

  // Add excerpt filter for blog posts
  eleventyConfig.addFilter("excerpt", function(content) {
    const excerpt = content.split('<!-- more -->')[0];
    return excerpt;
  });

  // Add limit filter for arrays
  eleventyConfig.addFilter("limit", function(array, limit) {
    return array.slice(0, limit);
  });

  // Add truncate filter for strings
  eleventyConfig.addFilter("truncate", function(str, length) {
    if (!str) return '';
    return str.length > length ? str.substring(0, length) + '...' : str;
  });

  // Multilingual filters
  const siteData = require('./src/_data/site.js');
  
  // Get alternate language URL
  eleventyConfig.addFilter("alternateUrl", function(url, targetLang) {
    if (!url) return '';
    const currentLang = this.ctx.lang || siteData.defaultLocale;
    
    if (targetLang === currentLang) {
      return url;
    }
    
    if (targetLang === 'en') {
      return '/en' + (url === '/' ? '' : url);
    }
    
    if (currentLang === 'en' && url.startsWith('/en')) {
      return url.replace('/en', '') || '/';
    }
    
    return url;
  });

  // Get current page URL for hreflang
  eleventyConfig.addFilter("absoluteUrl", function(url) {
    if (!url) return siteData.url;
    return siteData.url + (url.startsWith('/') ? url : '/' + url);
  });

  // Collections for blog posts
  eleventyConfig.addCollection("blog", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/*.md").reverse();
  });

  // Collections for case studies
  eleventyConfig.addCollection("caseStudies", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/case-studies/*.md").reverse();
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
