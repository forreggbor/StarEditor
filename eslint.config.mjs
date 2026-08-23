import { buildConfig } from "/home/gabor/.claude/hooks/eslint-toolchain/base.config.mjs";

// This is the canonical source — StarEditor.js defines the `StarEditor`
// global for CONSUMING projects, but has no external dependency on it
// itself, so no project-specific globals are needed here beyond the shared
// browser/jquery baseline that buildConfig() already provides.
export default buildConfig({
  fileOverrides: [
    { ignores: ["dist/**", "archive/**", "**/*.min.js"] },
    {
      // Standard UMD guard (`typeof module !== 'undefined' && module.exports
      // = ...`) for optional CommonJS/Node consumption.
      files: ["StarEditor.js"],
      languageOptions: { globals: { module: "readonly" } },
    },
  ],
});
