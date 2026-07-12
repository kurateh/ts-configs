# kurateh lint packages

[English](./README.md) | 한국어

ESLint와 Oxlint에서 사용하는 개인 lint 패키지 모노레포입니다. 패키지는 다음 세 가지로 분리되어 있습니다.

- `@kurateh/eslint-plugin`: 커스텀 ESLint rule.
- `@kurateh/eslint-config`: plugin을 포함한 공유 ESLint flat config.
- `@kurateh/oxlint-config`: ESLint plugin bridge를 통해 같은 커스텀 rule을 켜는 공유 Oxlint config.

## 환경 요구 사항

- **Node.js**: >=24
- **ESLint**: ESLint 사용 시 >=9
- **Oxlint**: Oxlint 사용 시 >=1.73
- **TypeScript**: >=6

## 패키지

### `@kurateh/eslint-config`

권장 ESLint 설정을 그대로 사용하고 싶을 때 이 패키지를 사용합니다.

```bash
pnpm add -D @kurateh/eslint-config eslint typescript
```

`eslint.config.mjs`:

```javascript
import kurateh from "@kurateh/eslint-config"

export default [
  ...kurateh.recommended,
  {
    rules: {
      "no-console": "off",
    },
  },
]
```

React 프로젝트:

```javascript
import kurateh from "@kurateh/eslint-config"

export default [...kurateh.react]
```

제공 config:

- `recommended`: Prettier, import 정렬, unused import 정리, `@kurateh/import-path`를 포함한 TypeScript 중심 ESLint flat config.
- `react`: `recommended`에 React와 React Hooks rule을 추가한 config.

### `@kurateh/eslint-plugin`

커스텀 rule만 사용하고 나머지 ESLint 설정은 직접 구성하고 싶을 때 이 패키지를 사용합니다.

```bash
pnpm add -D @kurateh/eslint-plugin eslint
```

`eslint.config.mjs`:

```javascript
import kuratehPlugin from "@kurateh/eslint-plugin"

export default [
  {
    plugins: {
      "@kurateh": kuratehPlugin,
    },
    rules: {
      "@kurateh/import-path": "warn",
    },
  },
]
```

Rules:

- `@kurateh/import-path`: 하위 모듈 import는 relative path를, 상위 모듈 import는 alias 기반 absolute path를 사용하도록 강제합니다.

### `@kurateh/oxlint-config`

Oxlint에서도 같은 커스텀 rule을 사용하고 싶을 때 이 패키지를 사용합니다.

```bash
pnpm add -D @kurateh/oxlint-config oxlint typescript
```

`oxlint.config.ts`:

```typescript
import { defineConfig } from "oxlint"
import config from "@kurateh/oxlint-config"

export default defineConfig({
  extends: [config],
})
```

## 예제

- `examples/eslint`: ESLint config 패키지 사용 예제.
- `examples/oxlint`: Oxlint config 패키지 사용 예제.

## 개발

```bash
pnpm install
pnpm build
pnpm lint
pnpm test
```

전체 검사:

```bash
pnpm check
```

## 릴리스

이 저장소는 `packages/*` 아래의 패키지를 npm에 배포하는 구조입니다. 배포 전 `CHANGELOG.md`를 업데이트하고, 워크스페이스 검사를 실행한 뒤, 설정된 release workflow로 변경된 패키지를 배포합니다.

npm 배포를 위해서는 GitHub Secrets에 `NPMJS_ACCESS_TOKEN`이 등록되어 있어야 합니다.
