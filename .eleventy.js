// eleventy.js CORREGIDO
module.exports = function(eleventyConfig) {

  // --- Copia de Archivos Estáticos (LA FORMA CORRECTA) ---
  // Esto copia {input}/css -> {output}/css
  eleventyConfig.addPassthroughCopy({ "build/css": "css" });
  eleventyConfig.addPassthroughCopy({ "build/js": "js" });
  eleventyConfig.addPassthroughCopy({ "build/auth": "auth" });
  
  // Copia archivos individuales
  eleventyConfig.addPassthroughCopy("build/*.pdf");
  
  // Copia la carpeta de datos
  eleventyConfig.addPassthroughCopy({ "build/data": "data" });

  // No necesitas esta línea si ya copiaste "build/js"
  // eleventyConfig.addPassthroughCopy("build/sw.js"); 

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