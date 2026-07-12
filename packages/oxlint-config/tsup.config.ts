import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["index.ts"],
  splitting: true,
  sourcemap: false,
  clean: true,
  format: ["esm", "cjs"],
  dts: true,
  treeshake: true,
  banner: ({ format }) => {
    if (format === "esm")
      return {
        js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
      }
    return {}
  },
})
