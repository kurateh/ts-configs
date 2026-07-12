import { defineConfig } from "oxlint"

export default defineConfig({
  jsPlugins: ["@kurateh/eslint-plugin"],
  rules: {
    "@kurateh/import-path": "warn",
  },
  categories: {
    correctness: "warn",
  },
  options: {
    typeAware: true,
    typeCheck: true,
  },
})
