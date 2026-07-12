# kurateh lint packages

English | [한국어](./README.ko.md)

Personal lint packages for ESLint and Oxlint. This repository is a monorepo split into three packages:

- `@kurateh/eslint-plugin`: custom ESLint rules.
- `@kurateh/eslint-config`: shareable ESLint flat configs built on top of the plugin.
- `@kurateh/oxlint-config`: shareable Oxlint config that enables the same custom rule through the ESLint plugin bridge.

## Requirements

- **Node.js**: >=24
- **ESLint**: >=9 for ESLint users
- **Oxlint**: >=1.73 for Oxlint users
- **TypeScript**: >=6

## Packages

### `@kurateh/eslint-config`

Use this package when you want the recommended ESLint setup.

```bash
pnpm add -D @kurateh/eslint-config eslint typescript
```

`eslint.config.mjs`:

```javascript
import kurateh from "@kurateh/eslint-config"

export default [ ...kurateh.recommended]
```

For React projects:

```javascript
import kurateh from "@kurateh/eslint-config"

export default [...kurateh.react]
```

Provided configs:

- `recommended`: TypeScript-oriented ESLint flat config with Prettier, import ordering, unused import cleanup, and `@kurateh/import-path`.
- `react`: `recommended` plus React and React Hooks rules.

### `@kurateh/eslint-plugin`

Use this package when you only want the custom rules and will manage the rest of the ESLint config yourself.

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

- `@kurateh/import-path`: enforces relative imports for child modules and absolute alias imports for parent modules.

### `@kurateh/oxlint-config`

Use this package when you want the same custom rule in Oxlint.

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

## Examples

- `examples/eslint`: ESLint config package usage.
- `examples/oxlint`: Oxlint config package usage.

## Development

```bash
pnpm install
pnpm build
pnpm lint
pnpm test
```

Run all checks:

```bash
pnpm check
```

## Release

This repository is intended to publish the packages under `packages/*` to npm. Before releasing, update `CHANGELOG.md`, run the workspace checks, and publish the changed packages with the configured release workflow.

`NPMJS_ACCESS_TOKEN` must be registered in GitHub Secrets for npm publishing.
