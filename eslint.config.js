import js from "@eslint/js";
import globals from "globals";
import ts from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "no-console": "warn",
      "no-underscore-dangle": "off",
      quotes: ["error", "double"],
      semi: ["error", "always"],
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["**/*.ts"],
    plugins: { ts },
    extends: ts.configs.recommended,
    languageOptions: {
      parser: ts.parser,
      parserOptions: { project: "./tsconfig.json", sourceType: "module" },
    },
    rules: {
      "@typescript-eslint/explicit-module-boundary-types": "off", // Allow implicit return types
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }], // Ignore linting in if variable starts with "_"
    },
  },
]);
