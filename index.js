const semver = require('semver')
const fs = require('fs');

const version = process.env.INPUT_VERSION
const level = process.env.INPUT_LEVEL.toLowerCase()

const validLevels = ['major', 'minor', 'patch']

if (!validLevels.includes(level)) {
  console.log(`::error::level parameter (${level}) must be one of the followings: major, minor, path`)
  process.exit(1)
}

newVersion = (version.startsWith('v') ? 'v' : '') + semver.inc(version, level)

fs.appendFileSync(process.env.GITHUB_OUTPUT, `version=${newVersion}\n`);
process.exit(0);
