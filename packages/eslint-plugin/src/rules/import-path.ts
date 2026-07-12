import { existsSync, readFileSync } from "node:fs"
import path, { join } from "node:path"

import { createRule } from "@/utils"

const posix = path.posix

const TS_CONFIG_FILE_NAMES = ["tsconfig.path.json", "tsconfig.json"]

/**
 * map에 path가 존재하는지 확인한다.
 * @param map 확인하려는 map
 * @param path 확인하려는 path
 * @returns path가 존재하면 true, 아니면 false
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const has = (map: Record<string, any>, path: string) => {
  let inner = map
  for (const step of path.split(".")) {
    inner = inner[step]
    if (inner === undefined) {
      return false
    }
  }
  return true
}

/**
 * 경로를 Posix 스타일(/)로 통일한다.
 */
const normalizePath = (p: string) => p.replace(/\\/g, "/")

/**
 * initialPath에서 시작하여 filename의 절대 경로를 탐색한다.
 * @param filename 탐색하려는 파일 이름
 * @param initialPath 탐색을 시작하는 위치
 * @returns filename의 절대 경로. 없으면 undefined
 */
const findFilePath = (filename: string, initialPath: string) => {
  let dir = initialPath
  let lastDir: string

  do {
    lastDir = dir
    dir = posix.dirname(dir)
  } while (!existsSync(join(dir, filename)) && dir !== lastDir)

  const filePath = join(dir, filename)

  if (!existsSync(filePath)) {
    return
  }

  return normalizePath(filePath)
}

const getAbsolutePathInfo = (fileName: string) => {
  const normalizedFileName = normalizePath(fileName)
  for (const configPath of TS_CONFIG_FILE_NAMES) {
    const filePath = findFilePath(configPath, normalizedFileName)

    if (filePath === undefined) {
      continue
    }

    const baseDir = normalizePath(posix.dirname(filePath))

    const tsPathConfig = JSON.parse(
      readFileSync(filePath, {
        encoding: "utf-8",
      })
        // remove single line comments NOT in strings
        .replace(
          /("(?:[^"\\]|\\.)*")|\/\/.*/g,
          (_: string, string: string) => string || "",
        )
        // remove multi-line comments NOT in strings
        .replace(
          /("(?:[^"\\]|\\.)*")|\/\*[\s\S]*?\*\//g,
          (_: string, string: string) => string || "",
        )
        // remove trailing commas
        .replace(/,(?=\s*[\]}])/g, ""),
    )

    const result: { baseUrl: string; paths: Record<string, string[]> } = {
      baseUrl: "",
      paths: {},
    }

    if (has(tsPathConfig, "compilerOptions.baseUrl")) {
      result.baseUrl = normalizePath(
        posix.join(baseDir, tsPathConfig.compilerOptions.baseUrl),
      )
    }

    if (has(tsPathConfig, "compilerOptions.paths")) {
      result.paths = Object.fromEntries(
        Object.entries<string[]>(tsPathConfig.compilerOptions.paths).map(
          ([key, value]: [string, string[]]) => [
            key.replace(/\/\*$/, "/"),
            value.map((path: string) =>
              normalizePath(posix.join(baseDir, path)).replace(/\/\*$/, "/"),
            ),
          ],
        ),
      )
    }

    return result
  }

  return
}

type MessageIds = "shouldBeRelativePath" | "shouldBeAbsolutePath"

export default createRule<[], MessageIds>({
  meta: {
    type: "suggestion",
    fixable: "code",
    messages: {
      shouldBeRelativePath:
        'When importing a child module, you must use the relative path. Use "{{expectedPath}}" instead of "{{source}}".',
      shouldBeAbsolutePath:
        'When importing a parent module, you must use the absolute path. Use "{{expectedPath}}" instead of "{{source}}".',
    },
    schema: [],
    docs: {
      description:
        "Enforce import path according to the location of the imported file.",
    },
  },
  defaultOptions: [],
  create: (context) => {
    const fileName = normalizePath(context.filename)
    const absolutePathInfo = getAbsolutePathInfo(fileName)

    return {
      ImportDeclaration: (node) => {
        if (absolutePathInfo === undefined) {
          return
        }

        const source = node.source.value

        if (source.startsWith("..")) {
          const sourceAbsolutePath = normalizePath(
            posix.join(posix.dirname(fileName), source),
          )

          for (const [alias, paths] of Object.entries(absolutePathInfo.paths)) {
            for (const path of paths) {
              if (sourceAbsolutePath.startsWith(path)) {
                const expectedPath = sourceAbsolutePath.replace(path, alias)

                context.report({
                  node,
                  messageId: "shouldBeAbsolutePath",
                  data: {
                    expectedPath,
                    source,
                  },
                  fix(fixer) {
                    return fixer.replaceText(node.source, `"${expectedPath}"`)
                  },
                })

                return
              }
            }
          }

          return
        }

        let sourceAbsolutePath: string | undefined
        for (const [alias, paths] of Object.entries(absolutePathInfo.paths)) {
          for (const path of paths) {
            if (source.startsWith(alias)) {
              sourceAbsolutePath = normalizePath(
                posix.join(path, source.replace(alias, "")),
              )
              break
            }
          }

          if (sourceAbsolutePath !== undefined) {
            break
          }
        }

        if (sourceAbsolutePath === undefined) {
          return
        }

        const sourceRelativePath = normalizePath(
          posix.relative(posix.dirname(fileName), sourceAbsolutePath),
        )

        if (sourceRelativePath.startsWith("..")) {
          return
        }

        const expectedPath = "./" + sourceRelativePath

        context.report({
          node,
          messageId: "shouldBeRelativePath",
          data: {
            expectedPath,
            source,
          },
          fix(fixer) {
            return fixer.replaceText(node.source, `"${expectedPath}"`)
          },
        })

        return
      },
    }
  },
})
