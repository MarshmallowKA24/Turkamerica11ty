module.exports = function(eleventyConfig) {
  // 1. Copiar los archivos estáticos necesarios.
  // Eleventy ya procesa los HTMLs dentro de 'build'. Necesitamos copiar el resto.
  
  // Copia carpetas de activos: CSS, JS y la subcarpeta AUTH
  eleventyConfig.addPassthroughCopy("build/css");
  eleventyConfig.addPassthroughCopy("build/js");
  eleventyConfig.addPassthroughCopy("build/auth"); 

  // Copia archivos estáticos directos (como PDFs y Service Worker)
  eleventyConfig.addPassthroughCopy("build/*.pdf");
  eleventyConfig.addPassthroughCopy("sw.js"); // sw.js está en la raíz, pero si lo usa, es importante copiarlo.
  
  // Copia la carpeta de datos (si no contiene plantillas, sino solo datos/scripts que se usan directamente)
  eleventyConfig.addPassthroughCopy("build/data"); 

  return {
    // 2. Definición de directorios
    dir: {
      input: "build",         // Eleventy buscará los archivos fuente (sus HTMLs) aquí.
      includes: "_includes",  // Los layouts (_base.njk) irán en 'build/_includes'.
      output: "_site"         // Directorio de salida.
    },
    // 3. Configuración del motor de plantilla
    htmlTemplateEngine: "njk", 
    markdownTemplateEngine: "njk"
  };
};