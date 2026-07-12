import { defineConfig } from "oxlint"
import config from "./index.ts"

export default defineConfig({
  extends: [config],
})
