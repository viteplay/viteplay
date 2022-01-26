module.exports = {
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  extends: ["plugin:vue/vue3-recommended", "prettier"],
  rules: {
    "no-unused-vars": [
      "error",
      // we are only using this rule to check for unused arguments since TS
      // catches unused variables but not args.
      { varsIgnorePattern: ".*", args: "none" },
    ],
    "vue/require-component-is": "off",
  },
}
