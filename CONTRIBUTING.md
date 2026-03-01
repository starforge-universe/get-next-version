# Contributing

Thank you for your interest in contributing to **get-next-version** — the utility that generates the next semantic version number for use in GitHub Workflows.

## How to Contribute

We use a fork-based workflow. To propose changes:

1. **Fork the repository on GitHub**
   - Open [get-next-version](https://github.com/starforge-universe/get-next-version) on GitHub
   - Click **Fork** to create a copy under your account

2. **Clone your fork locally**
   ```bash
   git clone https://github.com/YOUR_USERNAME/get-next-version.git
   cd get-next-version
   ```

3. **Add the upstream repository**
   ```bash
   git remote add upstream https://github.com/starforge-universe/get-next-version.git
   ```

4. **Create a feature branch**
   ```bash
   git checkout main
   git pull upstream main
   git checkout -b feature/your-feature-name
   ```

5. **Make your changes**
   - Follow existing code style and patterns in `index.js` and `action.yml`
   - Keep the action’s inputs (`version`, `level`) and outputs (`version`, `version_plain`) consistent
   - Update the README if you change usage, inputs, or outputs
   - Add or update tests in `tests/` for any change to version logic

6. **Run tests and build**
   ```bash
   npm install
   npm test
   npm run ncc
   ```
   All tests must pass. If you changed behavior, ensure the test suite still reflects the intended semantics.

7. **Commit and push to your fork**
   ```bash
   git add .
   git commit -m "Description of your changes"
   git push origin feature/your-feature-name
   ```

8. **Open a pull request**
   - Open a pull request from your branch to `starforge-universe/get-next-version` main
   - Describe what you changed and why
   - Reference any related issues

9. **Ensure checks pass**
   - The project runs automated checks on pull requests (see `.github/workflows/__call__checks.yaml`)
   - You can run the same checks locally: install dependencies, run `npm test`, and (if needed) `npm run ncc`
   - All checks must pass before the PR can be merged

10. **Address review feedback**
    - Changes may require approval from code owners (see `.github/CODEOWNERS`)
    - Update the PR based on feedback and ensure checks still pass

## What to Contribute

Contributions that fit this project well:

- **Version logic** – Fixes or improvements to how the next version is computed (e.g. edge cases, pre-release handling), with tests
- **Action interface** – Clearer inputs/outputs or documentation in `action.yml` and README
- **Tests** – New or updated tests in `tests/` for existing or new behavior
- **Documentation** – README, CONTRIBUTING, or inline comments to make usage and behavior clearer
- **Dependencies** – Updates to dependencies (e.g. `semver`) with tests and, if needed, a note in the PR

## Keeping Your Fork Up to Date

Before starting new work or rebasing your branch:

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

Then rebase your feature branch if needed:

```bash
git checkout feature/your-feature-name
git rebase main
```

## Code of Conduct

- Be respectful and constructive in discussions and reviews
- Follow the project’s coding style and keep the test suite passing

## Questions

- Open an [issue](https://github.com/starforge-universe/get-next-version/issues) for bugs or feature ideas
- See [README.md](README.md) for how the utility works and how to use it in workflows
