# Tests for get-next-version GitHub Action

This directory contains comprehensive tests for the `get-next-version` GitHub Action.

## Test Coverage

The test suite covers the following scenarios:

### Version Increment Logic
- ✅ Patch version increments (1.0.0 → 1.0.1)
- ✅ Minor version increments (1.0.0 → 1.1.0)
- ✅ Major version increments (1.0.0 → 2.0.0)

### Version Prefix Handling
- ✅ Preserves 'v' prefix when input has it (v1.0.0 → v1.0.1)
- ✅ No prefix added when input doesn't have it (1.0.0 → 1.0.1)
- ✅ Handles 'v' prefix with all increment types

### Input Validation
- ✅ Rejects invalid level parameters
- ✅ Case insensitive level handling (PATCH, MiNoR, etc.)
- ✅ Proper error messages for invalid inputs

### Edge Cases
- ✅ Pre-release versions (1.0.0-alpha.1 → 1.0.0)
- ✅ Build metadata (1.0.0+build.1 → 1.0.1)
- ✅ Complex pre-release with build metadata
- ✅ Version 0.x.x handling

### Output Format
- ✅ Correct GitHub Actions output format
- ✅ Both `version` and `version_plain` outputs
- ✅ Proper newline formatting

### Real-world Scenarios
- ✅ Typical patch, minor, and major release scenarios
- ✅ Various version formats and edge cases

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Structure

The tests use Jest and spawn the actual `index.js` file as a child process to test the real behavior, including:
- Environment variable handling
- File system operations (GitHub Actions output)
- Process exit codes
- Standard output and error streams

This approach ensures we're testing the actual production code behavior rather than mocked implementations.
