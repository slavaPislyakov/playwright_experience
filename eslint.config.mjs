import eslintJS from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import eslintPluginTS from "@typescript-eslint/eslint-plugin";
import eslintParserTS from "@typescript-eslint/parser";
import jsoncPlugin from "eslint-plugin-jsonc";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import jsonParser from "jsonc-eslint-parser";
import eslintTS from "typescript-eslint";

// === МОДУЛЬНАЯ ОРГАНИЗАЦИЯ ПРАВИЛ ===

// Базовые правила кода
const baseCodeRules = {
  "no-shadow": "error",
  "linebreak-style": ["error", "unix"],
  "no-console": "error",
  "comma-spacing": ["error", { before: false, after: true }],
};

// Стилистические правила
const stylisticRules = {
  "@stylistic/quotes": ["error", "double"],
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
};

// Правила переносов строк
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

// TypeScript специфичные правила
const typescriptRules = {
  "@typescript-eslint/explicit-function-return-type": "error",
  "@typescript-eslint/no-floating-promises": "error",
  "@typescript-eslint/await-thenable": "error",
  "@typescript-eslint/no-unused-vars": "error",
  "@typescript-eslint/no-unsafe-return": "error",
  "@typescript-eslint/no-explicit-any": ["error", { fixToUnknown: true }],
};

// Правила сортировки импортов
const importRules = {
  "simple-import-sort/imports": [
    "error",
    {
      groups: [
        ["^@?\\w"],
        ["^@@/api/fixtures/"],
        ["^@@/api/clients/"],
        ["^@@/api/assertions/"],
        ["^@@/api/data/"],
        ["^@@/api/types/"],
        ["^@@/api/utils/"],
        ["^@@/ui/fixtures/"],
        ["^@@/ui/steps/"],
        ["^@@/ui/pages/"],
        ["^@@/ui/components/"],
      ],
    },
  ],
  "simple-import-sort/exports": "error",
};

// === КОМБИНИРОВАННЫЕ НАБОРЫ ПРАВИЛ ===
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

// === КОНФИГУРАЦИИ ===
const ignoreConfig = {
  ignores: ["allure-results/**", "node_modules/**", "playwright-report/**", "test-results/**"],
};

// Базовая конфигурация для всех JS/MJS файлов
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

// Конфигурация для TypeScript файлов
const typeScriptConfig = {
  files: ["ui/**/*.ts", "api/**/*.ts"],
  plugins: {
    "@typescript-eslint": eslintPluginTS,
    "simple-import-sort": simpleImportSort,
    "@stylistic": stylistic,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: "tsconfig.json",
      },
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
  rules: allTypeScriptRules, // Все правила сразу
};

// JSON конфигурация остается как есть
const jsonConfig = {
  files: ["ui/**/*.json"],
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
