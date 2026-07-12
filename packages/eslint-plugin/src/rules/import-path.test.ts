import { vi } from "vitest"
import rule from "./import-path"
import { ruleTester } from "@/rule-tester"

// Use a consistent root for tests
const root = "C:/project"

vi.mock("node:fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:fs")>()
  return {
    ...actual,
    existsSync: (p: string) => {
      const normalizedP = p.replace(/\\/g, "/")
      if (normalizedP.includes(`${root}/tsconfig.json`)) return true
      return actual.existsSync(p)
    },
    readFileSync: (p: string, options: unknown) => {
      const normalizedP = p.replace(/\\/g, "/")
      if (normalizedP.includes(`${root}/tsconfig.json`)) {
        return JSON.stringify({
          compilerOptions: {
            baseUrl: ".",
            paths: {
              "@/*": ["src/*"],
            },
          },
        })
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return actual.readFileSync(p, options as any)
    },
  }
})

ruleTester.run("import-path", rule, {
  valid: [
    {
      // Same directory
      code: 'import { foo } from "./utils";',
      filename: `${root}/src/main.ts`,
    },
    {
      // Parent directory -> absolute path (Alias) is correct
      code: 'import { foo } from "@/utils";',
      filename: `${root}/src/sub/module.ts`,
    },
  ],
  invalid: [
    {
      // Parent directory using relative -> should be absolute
      code: 'import { foo } from "../utils";',
      filename: `${root}/src/sub/module.ts`,
      errors: [{ messageId: "shouldBeAbsolutePath" }],
      output: 'import { foo } from "@/utils";',
    },
    {
      // Child directory using absolute -> should be relative
      code: 'import { foo } from "@/sub/module";',
      filename: `${root}/src/main.ts`,
      errors: [{ messageId: "shouldBeRelativePath" }],
      output: 'import { foo } from "./sub/module";',
    },
  ],
})
