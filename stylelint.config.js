/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard"],
  // Lint the <style> blocks inside .astro components, not just standalone CSS.
  overrides: [
    {
      files: ["**/*.astro"],
      customSyntax: "postcss-html",
    },
  ],
  rules: {
    "unit-allowed-list": ["em", "rem", "vh", "vw", "%", "px", "s", "fr", "ch"],
    // `:global` is Astro's scoped-style escape hatch, not a standard pseudo-class.
    "selector-pseudo-class-no-unknown": [
      true,
      { ignorePseudoClasses: ["global"] },
    ],
    // Allow a comment to directly follow another comment (e.g. a note + its URL).
    "comment-empty-line-before": [
      "always",
      { except: ["first-nested"], ignore: ["stylelint-commands", "after-comment"] },
    ],
    // Allow Tailwind-style responsive utility classes (e.g. `.lg\:gap-4`)
    // alongside standard kebab-case class names.
    "selector-class-pattern": [
      "^[a-z][a-z0-9]*(-[a-z0-9]+)*(:[a-z][a-z0-9]*(-[a-z0-9]+)*)?$",
      {
        message:
          "Expected class to be kebab-case, with an optional `prefix:` modifier",
      },
    ],
    // Keep the original casing of font-family names.
    "value-keyword-case": [
      "lower",
      {
        ignoreKeywords: [
          "BlinkMacSystemFont",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "Inter",
          "Geologica",
          "currentColor",
        ],
      },
    ],
  },
};
