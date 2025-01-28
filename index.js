const semver = require('semver')
const fs = require('fs');

const version = process.env.INPUT_VERSION
const level = process.env.INPUT_LEVEL.toLowerCase()

const validLevels = ['major', 'minor', 'patch']

if (!validLevels.includes(level)) {
  console.log(`::error::level parameter (${level}) must be one of the followings: major, minor, path`)
  process.exit(1)
}

newVersionPlain = semver.inc(version, level)
newVersion = (version.startsWith('v') ? 'v' : '') + newVersionPlain

fs.appendFileSync(process.env.GITHUB_OUTPUT, `version=${newVersion}\n`);
fs.appendFileSync(process.env.GITHUB_OUTPUT, `version_plain=${newVersionPlain}\n`);
process.exit(0);
