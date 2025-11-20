// .eleventy.js
const fs = require("fs");

module.exports = function(eleventyConfig) {

  // --- Passthrough (rutas relativas a build/) ---
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("auth");
  eleventyConfig.addPassthroughCopy("data");
  eleventyConfig.addPassthroughCopy("*.pdf");
  eleventyConfig.addPassthroughCopy("sw.js");

  // ===== Observar cambios =====
  eleventyConfig.addWatchTarget("css/**/*.css");
  eleventyConfig.addWatchTarget("js/**/*.js");
  eleventyConfig.addWatchTarget("data/**/*.json");
  eleventyConfig.addWatchTarget("sw.js");

  // ===== FIX UTF-8 para Nunjucks =====
  eleventyConfig.setNunjucksEnvironmentOptions({
    autoescape: false,
    throwOnUndefined: true
  });

  eleventyConfig.addFilter("safe", function(value) {
    return value;
  });

  // ===== Limpieza antes del build =====
  eleventyConfig.on("beforeBuild", () => {
    const tmpDir = "_site_tmp";
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
      console.log(`🧹 ${tmpDir} eliminado antes del build.`);
    }
  });

  return {
    dir: {
      input: "build",
      includes: "_includes",
      output: "_site_tmp"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["html", "njk", "md"],
    pathPrefix: "/"
  };
};