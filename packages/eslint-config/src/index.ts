import { ESLint } from "eslint"
import { recommendedConfig } from "./configs/recommended"
import { reactConfig } from "./configs/react"

const config: NonNullable<ESLint.Plugin["configs"]> = {
  recommended: recommendedConfig,
  react: reactConfig,
}

export default config
