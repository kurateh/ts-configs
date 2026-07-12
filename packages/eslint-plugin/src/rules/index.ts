import { type Rule } from "eslint"

import importPath from "./import-path"

export default {
  "import-path": importPath,
} as unknown as Record<string, Rule.RuleModule>
