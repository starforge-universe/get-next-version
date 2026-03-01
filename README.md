# get-next-version

A utility that generates the next semantic version number for use in GitHub Workflows. Use it inside GitHub Actions to compute the next version (major, minor, or patch) from a given version string and expose it as workflow outputs.

## Overview

This project is a **GitHub Action** that takes a current version and a bump level, then outputs the next version according to [Semantic Versioning](https://semver.org/). It is intended for use in release pipelines, tagging, and any workflow step that needs to compute the next version number (e.g. before creating a release or publishing a package).

## Features

- **Semantic versioning** – Uses [semver](https://www.npmjs.com/package/semver) to compute the next version from a base version.
- **Bump levels** – Supports `major`, `minor`, and `patch` increments.
- **Prefix handling** – Preserves a leading `v` in the output when the input version has it (e.g. `v1.0.0` → `v1.0.1`).
- **GitHub Actions outputs** – Writes `version` and `version_plain` to the workflow so later steps can use them.

## Usage in GitHub Workflows

### As a reusable workflow or step

Use the action in your workflow to get the next version and pass it to later steps (e.g. tag name, release name, or build metadata).

**Inputs:**

| Input     | Required | Description                                                                 |
|----------|----------|-----------------------------------------------------------------------------|
| `version` | Yes      | Current version (e.g. `1.0.0` or `v1.0.0`).                                 |
| `level`   | Yes      | Bump level: `major`, `minor`, or `patch`.                                  |

**Outputs:**

| Output         | Description                                              |
|----------------|----------------------------------------------------------|
| `version`       | Next version, with `v` prefix if the input had one.      |
| `version_plain` | Next version without prefix (e.g. `1.0.1`).             |

**Example:**

```yaml
- name: Get next version
  id: next
  uses: ./
  with:
    version: '1.0.0'
    level: 'patch'

- name: Use the next version
  run: |
    echo "Next version: ${{ steps.next.outputs.version }}"
    echo "Plain: ${{ steps.next.outputs.version_plain }}"
```

**Example with dynamic current version:**

```yaml
- name: Get latest tag (or default)
  id: tag
  run: |
    TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0")
    echo "version=${TAG}" >> $GITHUB_OUTPUT

- name: Get next version
  id: next
  uses: ./
  with:
    version: ${{ steps.tag.outputs.version }}
    level: 'minor'

- name: Create release
  run: |
    git tag ${{ steps.next.outputs.version }}
    git push origin ${{ steps.next.outputs.version }}
```

## Behavior

- **Patch** – Increments the patch segment: `1.0.0` → `1.0.1`, `v2.1.3` → `v2.1.4`.
- **Minor** – Increments the minor segment and resets patch: `1.0.0` → `1.1.0`.
- **Major** – Increments the major segment and resets minor and patch: `1.0.0` → `2.0.0`.
- **Prefix** – If the input starts with `v`, the output `version` also starts with `v`; `version_plain` is always without the prefix.
- **Pre-release / build metadata** – Inputs like `1.0.0-alpha.1` or `1.0.0+build.1` are valid; the action uses semver to compute the next version from the base version.

Invalid or unsupported bump levels produce an error and a non-zero exit code.

## Development

- **Runtime:** Node.js (see `action.yml` for the version used in the action).
- **Tests:** `npm test` (Jest). See `tests/` for the test suite.
- **Build:** The action runs from `dist/index.js` (bundled with `ncc`). Run `npm run ncc` to build.

## Repository structure

- `action.yml` – GitHub Action definition (inputs, outputs, entrypoint).
- `index.js` – Main logic (version bump and GitHub output writing).
- `dist/` – Bundled output used by the action (generated, typically committed for use in workflows).
- `tests/` – Jest tests for version logic and output format.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines. This repository may follow shared DevOps and template conventions; see [.github/merge-instructions.md](.github/merge-instructions.md) for template merging.

## License

Part of the StarForge Universe project.
