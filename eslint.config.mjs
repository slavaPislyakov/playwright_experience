import eslintJS from "@eslint/js";
import eslintPluginTS from "@typescript-eslint/eslint-plugin";
import eslintParserTS from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import eslintTS from "typescript-eslint";

/** @type {import("eslint").Linter.Config[]} */
export default eslintTS.config(
  eslintJS.configs.recommended,
  ...eslintTS.configs.recommended,
  eslintConfigPrettier,
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: {
      "@typescript-eslint": eslintPluginTS,
      "simple-import-sort": simpleImportSort,
      prettier: eslintPluginPrettier,
    },
    settings: {
      "import/resolver": {
        typescript: {},
      },
      "import/external-module-folders": ["node_modules", "@types"],
    },
    languageOptions: {
      parser: eslintParserTS,
      parserOptions: {
        project: "tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      ...eslintConfigPrettier.rules,
      ...eslintPluginPrettier.configs.recommended.rules,
      "prettier/prettier": "error",
      "no-shadow": "error",
      "linebreak-style": ["error", "unix"],
      "no-console": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // npm packages
            ["^@?\\w"],

            // Internal paths via aliases
            ["^@@/api/fixtures/"],
            ["^@@/api/clients/"],
            ["^@@/api/assertions/"],
            ["^@@/api/data/"],
            ["^@@/api/types/"],
            ["^@@/api/utils/"],

            ["^@@/ui/fixtures/"],
            ["^@@/ui/steps/"],
            ["^@@/ui/po/"],
            ["^@@/ui/components/"],
            // // Packages `react` related packages come first.
            // ["^react", "^\\w", "^@hookform", "^@radix-ui"],
            // // npm packages
            // // Anything that starts with a letter (or digit or underscore), or `@` followed by a letter.
            // // ['^\\w'],
            // // Internal packages.
            // ["^@store(/.*|$)"],
            // ["^@components(/.*|$)"],
            // ["^@ui(/.*|$)"],
            // ["^@lib(/.*|$)"],
            // ["^@pages(/.*|$)"],
            // ["^@utils(/.*|$)"],
            // ["^@hooks(/.*|$)"],
            // ["^@services(/.*|$)"],
            // // Side effect imports.
            // ["^\\u0000"],
            // // Parent imports. Put `..` last.
            // ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            // // Other relative imports. Put same-folder imports and `.` last.
            // ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            // // Style imports.
            // ["^.+\\.?(css)$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },
  {
    ignores: ["node_modules"],
  },
);
