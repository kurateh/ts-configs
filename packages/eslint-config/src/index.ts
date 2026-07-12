import { type ESLint } from "eslint"

import { reactConfig } from "./configs/react"
import { recommendedConfig } from "./configs/recommended"

const config: NonNullable<ESLint.Plugin["configs"]> = {
  recommended: recommendedConfig,
  react: reactConfig,
}

export default config
