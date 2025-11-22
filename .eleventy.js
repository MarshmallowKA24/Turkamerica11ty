// .eleventy.js adaptado para deploy seguro
const fs = require("fs");
const path = require("path");

module.exports = function(eleventyConfig) {

    // --- Passthrough de assets estáticos (COMBINADO Y AJUSTADO) ---
    // Reglas existentes (asumiendo que los archivos están en 'build/...')
    eleventyConfig.addPassthroughCopy({ "build/css": "css" });
    eleventyConfig.addPassthroughCopy({ "build/js": "js" });
    eleventyConfig.addPassthroughCopy({ "build/data": "data" });
    
    // Archivos sueltos/root
    eleventyConfig.addPassthroughCopy({ "build/*.pdf": "." });
    eleventyConfig.addPassthroughCopy({ "build/sw.js": "sw.js" });
    
    // Reglas nuevas (asumiendo que estos archivos están en la raíz o en carpetas específicas)
    // Ajusta la fuente si 'public', 'icons', 'images' no están en la raíz del input dir.
    eleventyConfig.addPassthroughCopy("public");
    eleventyConfig.addPassthroughCopy("icons");
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("manifest.json");
    eleventyConfig.addPassthroughCopy("favicon.ico");
    
  

    // ===== FIX UTF-8 para Nunjucks =====
    eleventyConfig.setNunjucksEnvironmentOptions({
        autoescape: false,
        throwOnUndefined: true
    });

    eleventyConfig.addFilter("safe", function(value) {
        return value;
    });

    // ===== Añadir timestamp para Cache Busting (NUEVO) =====
    eleventyConfig.addGlobalData("timestamp", () => {
        return Date.now();
    });

    // ===== Opcional: limpieza de archivos antiguos en build temporal =====
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
            input: ".",          // raíz del proyecto
            includes: "build/_includes", // Mantenemos tu ruta de includes actual
            layouts: "build/_includes", // Añadido para layouts (o usa la ruta de includes si son la misma)
            data: "_data",       // Añadido para la carpeta _data
            // Si quieres output a "_site" (como el primer módulo), cámbialo aquí:
            output: "_site_tmp"  // Mantenemos tu build temporal para deploy
        },

        // --- Motor de templates ---
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk",

        // --- Templates permitidos ---
        templateFormats: ["html", "njk", "md"],
        pathPrefix: "/"
    };
};