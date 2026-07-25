import { defineConfig, type OxlintConfig } from "oxlint"

const defaultConfig = {
  jsPlugins: [
    "@kurateh/eslint-plugin",
    "eslint-plugin-perfectionist",
    "eslint-plugin-unused-imports",
  ],
  categories: {
    correctness: "warn",
  },
  plugins: ["eslint", "import", "typescript", "react", "react-perf"],
  options: {
    typeAware: true,
    typeCheck: true,
    denyWarnings: true,
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
    // TODO https://github.com/oxc-project/oxc/issues/479
    // camelcase: [1, { allow: ["^\\w*_[A-Z]*$"] }],
    "no-var": 2,
    "no-unused-vars": [
      1,
      {
        ignoreRestSiblings: true,
        vars: "all",
        args: "after-used",
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],

    // import
    "import/no-named-as-default-member": 0,
    // TODO https://github.com/oxc-project/oxc/pull/15703
    // "import/no-extraneous-dependencies": [
    //   2,
    //   {
    //     devDependencies: [
    //       "**/*.test.*",
    //       "**/*.stories.*",
    //       "**/*.config.*",
    //       "**/*.spec.*",
    //     ],
    //   },
    // ],
    // Since sorting imports is implemented in oxcfmt(https://oxc.rs/docs/guide/usage/formatter/sorting.html),
    // and currently oxcfmt does not support features like `prettier-plugin-classnames`(https://oxc.rs/docs/guide/usage/formatter/sorting.html),
    // use perfectionist to sort imports for now.
    "perfectionist/sort-imports": [
      1,
      {
        type: "alphabetical",
        order: "asc",
        fallbackSort: { type: "unsorted" },
        ignoreCase: true,
        specialCharacters: "keep",
        sortBy: "path",
        internalPattern: ["^~/.+", "^@/.+", "^#.+"],
        partitionByComment: false,
        partitionByNewLine: false,
        newlinesBetween: 1,
        newlinesInside: 0,
        maxLineLength: undefined,
        groups: [
          "type-import",
          ["value-builtin", "value-external"],
          "type-internal",
          "value-internal",
          ["type-parent", "type-sibling", "type-index"],
          ["value-parent", "value-sibling", "value-index"],
          "ts-equals-import",
          "unknown",
        ],
        customGroups: [],
        environment: "node",
        useExperimentalDependencyDetection: true,
      },
    ],

    // unused-imports
    "unused-imports/no-unused-imports": 1,

    // kurateh
    "@kurateh/import-path": 1,

    // typescript
    "typescript/consistent-type-imports": [
      1,
      {
        fixStyle: "inline-type-imports",
      },
    ],
  },
} satisfies OxlintConfig

const ts = defineConfig(defaultConfig)

const reactConfig: OxlintConfig = structuredClone(defaultConfig)
reactConfig.rules = {
  ...reactConfig.rules!,
  "react/react-in-jsx-scope": 0,
  "react/function-component-definition": [
    1,
    {
      namedComponents: "arrow-function",
      unnamedComponents: "arrow-function",
    },
  ],
  "react/jsx-curly-brace-presence": [
    1,
    {
      props: "never",
      children: "never",
    },
  ],
  "react/no-children-prop": 1,
}

const react = defineConfig(reactConfig)

export { ts, react }
