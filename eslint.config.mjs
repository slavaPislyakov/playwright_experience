import eslintJS from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import eslintParserTS from "@typescript-eslint/parser";
import importX from "eslint-plugin-import-x";
import jsoncPlugin from "eslint-plugin-jsonc";
import playwright from "eslint-plugin-playwright";
import globals from "globals";
import * as jsonParser from "jsonc-eslint-parser";
import eslintTS from "typescript-eslint";

const baseCodeRules = {
  "no-shadow": "error",
  "linebreak-style": ["error", "unix"],
  "no-console": "error",
  "comma-spacing": ["error", { before: false, after: true }],
  "prefer-template": "error",
  "no-template-curly-in-string": "warn",
};

const stylisticRules = {
  "@stylistic/quotes": ["error",
    "double",
    {
      avoidEscape: true,
    }],
  "@stylistic/semi": ["error", "always"],
  "@stylistic/indent": ["error", 2],
  "@stylistic/comma-dangle": ["error", "always-multiline"],
  "@stylistic/object-curly-spacing": ["error", "always"],
  "@stylistic/arrow-parens": ["error", "always"],
  "@stylistic/no-trailing-spaces": "error",
  "@stylistic/no-multiple-empty-lines": ["error",
    {
      max: 1,
      maxEOF: 0,
      maxBOF: 0,
    }],
  "@stylistic/eol-last": ["error", "always"],
  "@stylistic/max-len": ["warn",
    {
      code: 120,
      ignoreComments: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],
  "@stylistic/type-annotation-spacing": "error",
  "@stylistic/template-curly-spacing": ["error", "never"],
};

const lineBreakRules = {
  "@stylistic/operator-linebreak": ["error",
    "after",
    {
      "overrides": {
        "?": "before",
        ":": "before",
      },
    }],
  "@stylistic/object-curly-newline": ["error",
    {
      "ObjectExpression": { "multiline": true, "consistent": true },
      "ObjectPattern": { "multiline": true, "consistent": true },
      "ImportDeclaration": { "multiline": true, "consistent": true },
      "ExportDeclaration": { "multiline": true, "consistent": true },
    }],
  "@stylistic/object-property-newline": ["error",
    {
      "allowAllPropertiesOnSameLine": true,
    }],
  "@stylistic/function-paren-newline": ["error", "multiline"],
  "@stylistic/function-call-argument-newline": ["error", "consistent"],
  "@stylistic/array-element-newline": ["error",
    {
      "ArrayExpression": { "multiline": true, "consistent": true },
      "ArrayPattern": { "multiline": true, "consistent": true },
    }],
  "@stylistic/array-bracket-newline": ["error", "consistent"],
};

const typescriptRules = {
  "@typescript-eslint/explicit-function-return-type": "error",
  "@typescript-eslint/no-floating-promises": "error",
  "@typescript-eslint/await-thenable": "error",
  "@typescript-eslint/no-unused-vars": "error",
  "@typescript-eslint/no-unsafe-return": "error",
  "@typescript-eslint/no-explicit-any": ["error", { fixToUnknown: true }],
  "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
  "@typescript-eslint/no-misused-promises": "error",
  "@typescript-eslint/require-await": "warn",
  "@typescript-eslint/no-unnecessary-type-assertion": "error",
};

const importRules = {
  "import-x/order": [
    "error",
    {
      "groups": ["external", "builtin", "internal", "parent", "sibling", "index", "object"],
      "pathGroups": [
        { pattern: "@@/api/fixtures/**", group: "internal" },
        { pattern: "@@/api/clients/**", group: "internal", position: "after" },
        { pattern: "@@/api/assertions/**", group: "internal", position: "after" },
        { pattern: "@@/api/data/**", group: "internal", position: "after" },
        { pattern: "@@/api/types/**", group: "internal", position: "after" },
        { pattern: "@@/api/utils/**", group: "internal", position: "after" },
        { pattern: "@@/ui/fixtures/**", group: "internal", position: "after" },
        { pattern: "@@/ui/steps/**", group: "internal", position: "after" },
        { pattern: "@@/ui/pages/**", group: "internal", position: "after" },
        { pattern: "@@/ui/components/**", group: "internal", position: "after" },
      ],
      "pathGroupsExcludedImportTypes": ["type"],
      "named": true,
      "newlines-between": "always-and-inside-groups",
    },
  ],
  "import-x/newline-after-import": "error",
  "import-x/no-unresolved": "error",
  "import-x/no-duplicates": "warn",
};

const commonRules = {
  ...baseCodeRules,
  ...stylisticRules,
  ...lineBreakRules,
};

const allTypeScriptRules = {
  ...commonRules,
  ...typescriptRules,
  ...importRules,
};

const ignoreConfig = {
  ignores: ["allure-results/**", "node_modules/**", "playwright-report/**", "test-results/**"],
};

const baseJsConfig = {
  files: ["**/*.js", "**/*.mjs"],
  plugins: {
    "@stylistic": stylistic,
  },
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    globals: { ...globals.browser, ...globals.node },
  },
  rules: commonRules,
};

const typeScriptConfig = {
  files: ["ui/**/*.ts", "api/**/*.ts", "playwright.config.ts"],
  plugins: {
    "@typescript-eslint": eslintTS.plugin,
    "@stylistic": stylistic,
    "import-x": importX,
    playwright: playwright,
  },
  settings: {
    "import-x/resolver": {
      typescript: {
        project: "tsconfig.json",
      },
    },
    "import-x/external-module-folders": ["node_modules", "@types"],
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
    ...allTypeScriptRules,
    ...(playwright.configs ? playwright.configs["flat/recommended"].rules : {}),
    "playwright/no-skipped-test": "warn",
    "playwright/no-focused-test": "error",
    "playwright/expect-expect": [
      "warn",
      {
        assertFunctionPatterns: [
          // API assertions
          "checkStatusCode",
          "checkJSONResponseSchemaZod",
          "checkJSONResponseSchemaZodFails",
          "checkEveryItemHasFieldValue",
          "checkResponseItemsCount",
          "checkItemsSortedBy",
          "checkEveryItemContainsTextInFields",
          // UI assertions
          "checkAnonymousHeaderText",
          "checkNavigationElementIsVisible",
          "checkBlockOnPage",
          "checkCurrentUrl",
          "checkResultsHeaderContains",
          "checkVacancyItemsArePresent",
          "checkEmptySearchBlockIsVisible",
          "checkVacancyTitleIsVisible",
          "checkVacancyCompanyNameIsVisible",
          "checkVacancyDescriptionIsNotEmpty",
          "checkVacancyContentBlocksAreVisible",
          "checkCookiePolicyBannerIsVisible",
          "checkCookiePolicyBannerIsHidden",
        ],
      },
    ],
  },
};

const jsonConfig = {
  files: ["{ui,api}/**/*.json"],
  plugins: {
    "jsonc": jsoncPlugin,
  },
  languageOptions: {
    parser: jsonParser,
    parserOptions: {
      json: true,
      ecmaVersion: 2022,
      sourceType: "module",
    },
  },
  rules: {
    "jsonc/array-bracket-newline": ["error", "consistent"],
    "jsonc/array-bracket-spacing": ["error", "always"],
    "jsonc/array-element-newline": ["error", "consistent"],
    "jsonc/comma-dangle": ["error", "never"],
    "jsonc/indent": ["error", 2],
    "jsonc/key-spacing": ["error",
      {
        beforeColon: true,
        afterColon: true,
        mode: "strict",
      }],
    "jsonc/object-curly-newline": ["error",
      {
        "minProperties": 2,
        "multiline": true,
        "consistent": true,
      }],
    "jsonc/object-curly-spacing": ["error", "always"],
    "jsonc/object-property-newline": ["error",
      {
        allowAllPropertiesOnSameLine: true,
      }],
    "jsonc/quote-props": ["error", "always"],
    "jsonc/quotes": ["error", "double"],
    "no-multiple-empty-lines": ["error",
      {
        max: 1,
        maxEOF: 0,
        maxBOF: 0,
      }],
  },
};

export default eslintTS.config(
  ignoreConfig,
  eslintJS.configs.recommended,
  ...eslintTS.configs.recommended,
  baseJsConfig,
  typeScriptConfig,
  jsonConfig,
);
