import js from "@eslint/js"
import kuratehPlugin from "@kurateh/eslint-plugin"
import { type Linter } from "eslint"
import importPlugin from "eslint-plugin-import"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"
import unusedImportsPlugin from "eslint-plugin-unused-imports"
import globals from "globals"
import tseslint from "typescript-eslint"

export const recommendedConfig: Linter.Config[] = [
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  eslintPluginPrettierRecommended,
  ...(tseslint.configs.recommended as Linter.Config[]),
  importPlugin.flatConfigs.typescript,
  {
    // ESLint config block에 file이 있으면 해당 파일을 검사할 차례가 와서야 plugin이 적용됨
    // 따라서 이 Plugin을 끄려면 Config File에서 file: "~~"을 넣어야 됨
    // 이 과정을 없애기 위해 plugin 적용을 앞서 진행
    plugins: {
      "@kurateh": kuratehPlugin,
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
    ignores: ["node_modules/", "dist/", "build/", "coverage/"],
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`

          // Choose from one of the "project" configs below or omit to use <root>/tsconfig.json by default

          // use <root>/path/to/folder/tsconfig.json
          project: "tsconfig.json",

          // Multiple tsconfigs (Useful for monorepos)

          // use a glob pattern
          // project: "packages/*/tsconfig.json",

          // use an array
          // project: [
          //   "packages/module-a/tsconfig.json",
          //   "packages/module-b/tsconfig.json"
          // ],

          // use an array of glob patterns
          // project: [
          //   "packages/*/tsconfig.json",
          //   "other-packages/*/
        },
      },
    },
    plugins: {
      "unused-imports": unusedImportsPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.es2017,
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // eslint
      "no-console": 1,
      "object-shorthand": 1,
      "no-param-reassign": [
        2,
        {
          props: true,
          ignorePropertyModificationsForRegex: ["^draft$", "Draft$"],
        },
      ],
      camelcase: [1, { allow: ["^\\w*_[A-Z]*$"] }],
      "no-var": 2,

      // prettier
      "prettier/prettier": 1,

      // import
      "import/no-named-as-default-member": 0,
      "import/no-extraneous-dependencies": [
        2,
        {
          devDependencies: [
            "**/*.test.*",
            "**/*.stories.*",
            "**/*.config.*",
            "**/*.spec.*",
          ],
        },
      ],
      "import/order": [
        1,
        {
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          "newlines-between": "always",
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
          ],
          pathGroups: [
            {
              pattern: "~*/**",
              group: "internal",
            },
            {
              pattern: "@*/**",
              group: "internal",
            },
          ],
        },
      ],

      // unused-imports
      "unused-imports/no-unused-imports": 2,

      // kurateh
      "@kurateh/import-path": 1,

      // typescript
      "@typescript-eslint/no-unused-vars": [
        1,
        {
          ignoreRestSiblings: true,
          vars: "all",
          args: "after-used",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        1,
        {
          fixStyle: "inline-type-imports",
        },
      ],
      "import/no-unresolved": 0,
    },
  },
] satisfies Linter.Config[]
