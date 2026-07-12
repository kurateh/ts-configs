import type { ESLint } from "eslint"
import { readFileSync } from "node:fs"

import rules from "./rules"

const pkg = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf-8"),
)

const plugin: ESLint.Plugin = {
  meta: {
    name: "@kurateh/eslint-plugin",
    version: pkg.version,
  },
  rules,
} satisfies ESLint.Plugin

export default plugin
