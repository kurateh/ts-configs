# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Changed

- Update `oxlint` version to `^1.75.0`.
- Split oxlint config into `ts` and `react` exports.
- Use native `react/function-component-definition` rule instead of `eslint-plugin-react`'s version.
- Remove `eslint-plugin-react` dependency from `@kurateh/oxlint-config` package.
- Add `typescript@^6` as a peer dependency for `@kurateh/oxlint-config`. See https://github.com/azat-io/eslint-plugin-perfectionist/issues/757

## 11.0.0 - 2026-07-12

### Changed

- Migrate to monorepo
- Add oxlint config
- Upgrade pnpm and actions to latest version

## 10.1.0 - 2026-06-12

### Fixed

- Remove `no-unused-vars` of javascript rule

## 10.0.0 - 2026-04-26

### Added

- New `import-path` rule with Vitest-based test suite.
- `sample-project` for integration testing and demonstration.
- Project-wide Vitest configuration and `RuleTester` utility.
- `.prettierrc` for consistent code formatting.

### Changed

- Enhanced release workflow to support manual version specification via `custom-version` input.
- Comprehensive `README.md` update including installation, Flat Config setup, and deployment guides.
- Modernized `tsconfig.json` with `ES2022` target and `Bundler` module resolution.
- Improved `eslint.config.mjs` with React optimizations and test-specific overrides.
- Added plugin metadata (namespace, version) by reading `package.json` in `src/index.ts`.
- Improved path normalization logic in `import-path` rule for cross-platform compatibility.

## 2.0.0 - 2026-03-25

## 2.0.0-beta.1 - 2025-12-18

### Changed

- Rollback eslint
  - Since dts build sucks

## 2.0.0-beta.0 - 2025-12-18

### Changed

- Merge JS and TS configs
- Update rules
- Upgrade almost whole dependencies

### Fixed

- Fix DTS build

## 1.2.0 - 2025-11-23

### Fixed

- Fix a bug where comments format in strings would be removed when parsing tsconfig.json.

## 1.1.0 - 2025-07-09

### Fixed

- Fix a bug where comments or trailing commas in tsconfig.json would cause an error.

## 1.0.0 - 2024-12-23

## 0.1.0 - 2024-12-23

### Added

- Add Javascript, Typescript, React config
