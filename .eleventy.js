// eleventy.js CORREGIDO
module.exports = function(eleventyConfig) {

  // --- Copia de Archivos Estáticos (CORREGIDO) ---
  // Copia "build/css" a la carpeta "_site/css"
  eleventyConfig.addPassthroughCopy({ "build/css": "css" });
  eleventyConfig.addPassthroughCopy({ "build/js": "js" });
  eleventyConfig.addPassthroughCopy({ "build/auth": "auth" });
  eleventyConfig.addPassthroughCopy({ "build/data": "data" });
  
  // Copia archivos PDF y el Service Worker de la raíz de "build"
  eleventyConfig.addPassthroughCopy("build/*.pdf");
  eleventyConfig.addPassthroughCopy("sw.js"); // Copia el sw.js de la raíz del proyecto

  return {
    // --- Definición de directorios ---
    dir: {
      input: "build",   // Eleventy lee de 'build'
      includes: "_includes", // Los layouts están en 'build/_includes'
      output: "_site"   // Eleventy escribe en '_site'
    },

    // --- Configuración del motor de plantilla ---
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};