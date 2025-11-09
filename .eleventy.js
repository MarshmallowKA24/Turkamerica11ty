// .eleventy.js adaptado para deploy seguro
const fs = require("fs");
const path = require("path");

module.exports = function(eleventyConfig) {

  // --- Passthrough de assets estáticos ---
  // CSS y JS
  eleventyConfig.addPassthroughCopy("build/css");
  eleventyConfig.addPassthroughCopy("build/js");
  eleventyConfig.addPassthroughCopy("build/auth");
  eleventyConfig.addPassthroughCopy("build/data");

  // PDFs y service worker
  eleventyConfig.addPassthroughCopy("build/*.pdf");
  eleventyConfig.addPassthroughCopy("build/sw.js");

  // ===== FIX UTF-8 para Nunjucks =====
  eleventyConfig.setNunjucksEnvironmentOptions({
    autoescape: false,
    throwOnUndefined: true
  });

  eleventyConfig.addFilter("safe", function(value) {
    return value;
  });

  // ===== Opcional: limpieza de archivos antiguos en build temporal =====
  // Esto es útil si quieres un deploy limpio en _site_tmp_TIMESTAMP
  eleventyConfig.on("beforeBuild", () => {
    const tmpDir = "_site_tmp";
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
      console.log(`🧹 ${tmpDir} eliminado antes del build.`);
    }
  });

  return {
    // --- Directorios ---
    dir: {
      input: ".",                  // raíz del proyecto
      includes: "build/_includes", // includes
      output: "_site_tmp"           // build temporal para deploy
    },

    // --- Motor de templates ---
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",

    // --- Templates permitidos ---
    templateFormats: ["html", "njk", "md"],

    // Prefijo para rutas relativas, útil si alojas en subcarpeta
    pathPrefix: "/"
  };
};
