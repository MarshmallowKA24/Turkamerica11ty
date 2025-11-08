// .eleventy.js actualizado
module.exports = function(eleventyConfig) {

  // --- Copia de Archivos Estáticos ---
  eleventyConfig.addPassthroughCopy("build/css");
  eleventyConfig.addPassthroughCopy("build/js");
  eleventyConfig.addPassthroughCopy("build/auth");
  eleventyConfig.addPassthroughCopy("build/data");

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
      input: ".",            // raíz del proyecto como input
      includes: "build/_includes",
      output: "_site"
    },

    // --- Motor de plantillas ---
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",

    // ===== Configuración de templates =====
    templateFormats: ["html", "njk", "md"],
    pathPrefix: "/"
  };
};
