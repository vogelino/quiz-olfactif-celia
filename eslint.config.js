import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import solid from "eslint-plugin-solid";
import globals from "globals";
import tseslint from "typescript-eslint";

const solidTypeScript = solid.configs["flat/typescript"];

export default tseslint.config(
  {
    ignores: [".nitro", ".output", ".vercel", "dist", "node_modules", "eslint.config.js"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2024,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-undef": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: solidTypeScript.plugins,
    rules: solidTypeScript.rules,
  },
  prettier,
);
