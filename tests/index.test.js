const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

describe('get-next-version GitHub Action', () => {
  let originalEnv;
  let testOutputFile;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };
    
    // Create a temporary output file for each test
    testOutputFile = path.join(__dirname, `test-output-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
    
    // Clean up test output file
    if (fs.existsSync(testOutputFile)) {
      fs.unlinkSync(testOutputFile);
    }
  });

  const runAction = (version, level) => {
    return new Promise((resolve, reject) => {
      const child = spawn('node', ['index.js'], {
        env: {
          ...process.env,
          INPUT_VERSION: version,
          INPUT_LEVEL: level,
          GITHUB_OUTPUT: testOutputFile
        }
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        let output = '';
        if (fs.existsSync(testOutputFile)) {
          output = fs.readFileSync(testOutputFile, 'utf8');
        }
        
        resolve({
          code,
          stdout,
          stderr,
          output
        });
      });

      child.on('error', reject);
    });
  };

  describe('Version increment logic', () => {
    test('should increment patch version correctly', async () => {
      const result = await runAction('1.0.0', 'patch');
      
      expect(result.code).toBe(0);
      expect(result.output).toContain('version=1.0.1');
      expect(result.output).toContain('version_plain=1.0.1');
    });

    test('should increment minor version correctly', async () => {
      const result = await runAction('1.0.0', 'minor');
      
      expect(result.code).toBe(0);
      expect(result.output).toContain('version=1.1.0');
      expect(result.output).toContain('version_plain=1.1.0');
    });

    test('should increment major version correctly', async () => {
      const result = await runAction('1.0.0', 'major');
      
      expect(result.code).toBe(0);
      expect(result.output).toContain('version=2.0.0');
      expect(result.output).toContain('version_plain=2.0.0');
    });
  });

  describe('Version prefix handling', () => {
    test('should preserve v prefix in output when input has v prefix', async () => {
      const result = await runAction('v1.0.0', 'patch');
      
      expect(result.code).toBe(0);
      expect(result.output).toContain('version=v1.0.1');
      expect(result.output).toContain('version_plain=1.0.1');
    });

    test('should not add v prefix when input does not have v prefix', async () => {
      const result = await runAction('1.0.0', 'patch');
      
      expect(result.code).toBe(0);
      expect(result.output).toContain('version=1.0.1');
      expect(result.output).toContain('version_plain=1.0.1');
    });

    test('should handle v prefix with major increment', async () => {
      const result = await runAction('v1.0.0', 'major');
      
      expect(result.code).toBe(0);
      expect(result.output).toContain('version=v2.0.0');
      expect(result.output).toContain('version_plain=2.0.0');
    });
  });

  describe('Input validation', () => {
    test('should reject invalid level parameter', async () => {
      const result = await runAction('1.0.0', 'invalid');
      
      expect(result.code).toBe(1);
      expect(result.stdout).toContain('::error::level parameter (invalid) must be one of the followings: major, minor, path');
    });

    test('should handle case insensitive level parameter', async () => {
      const result = await runAction('1.0.0', 'PATCH');
      
      expect(result.code).toBe(0);
      expect(result.output).toContain('version=1.0.1');
    });

    test('should handle mixed case level parameter', async () => {
      const result = await runAction('1.0.0', 'MiNoR');
      
      expect(result.code).toBe(0);
      expect(result.output).toContain('version=1.1.0');
    });
  });

  describe('Edge cases and various version formats', () => {
    test('should handle pre-release versions', async () => {
      const result = await runAction('1.0.0-alpha.1', 'patch');
      
      expect(result.code).toBe(0);
      expect(result.output).toContain('version=1.0.0');
      expect(result.output).toContain('version_plain=1.0.0');
    });

    test('should handle build metadata', async () => {
      const result = await runAction('1.0.0+build.1', 'patch');
      
      expect(result.code).toBe(0);
      expect(result.output).toContain('version=1.0.1');
      expect(result.output).toContain('version_plain=1.0.1');
    });

    test('should handle complex pre-release with build metadata', async () => {
      const result = await runAction('1.0.0-alpha.1+build.1', 'minor');
      
      expect(result.code).toBe(0);
      expect(result.output).toContain('version=1.0.0');
      expect(result.output).toContain('version_plain=1.0.0');
    });

    test('should handle version with v prefix and pre-release', async () => {
      const result = await runAction('v1.0.0-alpha.1', 'major');
      
      expect(result.code).toBe(0);
      expect(result.output).toContain('version=v1.0.0');
      expect(result.output).toContain('version_plain=1.0.0');
    });
  });

  describe('Output format validation', () => {
    test('should output in correct GitHub Actions format', async () => {
      const result = await runAction('1.0.0', 'patch');
      
      expect(result.code).toBe(0);
      expect(result.output).toMatch(/^version=1\.0\.1\nversion_plain=1\.0\.1\n$/);
    });

    test('should output both version and version_plain', async () => {
      const result = await runAction('v2.1.3', 'minor');
      
      expect(result.code).toBe(0);
      expect(result.output).toContain('version=v2.2.0');
      expect(result.output).toContain('version_plain=2.2.0');
    });
  });

  describe('Real-world scenarios', () => {
    test('should handle typical patch release scenario', async () => {
      const result = await runAction('1.2.3', 'patch');
      
      expect(result.code).toBe(0);
      expect(result.output).toContain('version=1.2.4');
      expect(result.output).toContain('version_plain=1.2.4');
    });

    test('should handle typical minor release scenario', async () => {
      const result = await runAction('1.2.3', 'minor');
      
      expect(result.code).toBe(0);
      expect(result.output).toContain('version=1.3.0');
      expect(result.output).toContain('version_plain=1.3.0');
    });

    test('should handle typical major release scenario', async () => {
      const result = await runAction('1.2.3', 'major');
      
      expect(result.code).toBe(0);
      expect(result.output).toContain('version=2.0.0');
      expect(result.output).toContain('version_plain=2.0.0');
    });

    test('should handle version 0.x.x correctly', async () => {
      const result = await runAction('0.9.9', 'patch');
      
      expect(result.code).toBe(0);
      expect(result.output).toContain('version=0.9.10');
      expect(result.output).toContain('version_plain=0.9.10');
    });
  });
});
