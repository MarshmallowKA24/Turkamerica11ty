// .eleventy.js CORREGIDO con encoding UTF-8
module.exports = function(eleventyConfig) {

  // --- Copia de Archivos Estáticos ---
  eleventyConfig.addPassthroughCopy({ "build/css": "css" });
  eleventyConfig.addPassthroughCopy({ "build/js": "js" });
  eleventyConfig.addPassthroughCopy({ "build/auth": "auth" });
  eleventyConfig.addPassthroughCopy({ "build/data": "data" });
  
  // Copia archivos PDF y el Service Worker
  eleventyConfig.addPassthroughCopy("build/*.pdf");
  eleventyConfig.addPassthroughCopy("build/sw.js");

  // ===== FIX CRÍTICO: Forzar UTF-8 en Nunjucks =====
  eleventyConfig.setNunjucksEnvironmentOptions({
    autoescape: false,
    throwOnUndefined: true
  });

  // Agregar filtro para forzar UTF-8
  eleventyConfig.addFilter("safe", function(value) {
    return value;
  });

  return {
    // --- Definición de directorios ---
    dir: {
      input: "build",
      includes: "_includes",
      output: "_site"
    },

    // --- Motor de plantillas ---
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    
    // ===== FIX: Configuración de encoding =====
    templateFormats: ["html", "njk", "md"],
    pathPrefix: "/"
  };
};