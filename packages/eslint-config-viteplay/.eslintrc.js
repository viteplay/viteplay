module.exports = {
  ignorePatterns: ["dist", "node_modules"],
  env: {
    "browser": true,
    "es2021": true,
    "node": true,
    "vue/setup-compiler-macros": true, // enables `<script setup>`
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module",
    ecmaVersion: 2022,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-recommended",
    "prettier",
  ],
  rules: {
    "no-empty": "off",
    "no-unused-vars": [
      "error",
      // we are only using this rule to check for unused arguments since TS
      // catches unused variables but not args.
      { varsIgnorePattern: ".*", args: "none" },
    ],
    /** TypeScript rules */
    "@typescript-eslint/array-type": ["error", { default: "array" }],
    "@typescript-eslint/no-explicit-any": "off",
    /** Vue rules */
    "vue/script-setup-uses-vars": "error", // enables `<script setup>`
    "vue/require-component-is": "off",
    "vue/component-tags-order": ["error", { order: ["script", "template", "style"] }],
    "vue/attribute-hyphenation": ["error", "never", { ignore: [] }],
    "vue/v-on-event-hyphenation": ["error", "never"],
    "vue/no-v-html": "off",
  },
}
