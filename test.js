const assert = require('assert');
const http   = require('http');

// ── Helper: make an HTTP request and return { status, body }
function get(path) {
  return new Promise((resolve, reject) => {
    const req = http.get({ host: 'localhost', port: 3000, path }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.setTimeout(3000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

// ── Start the app in-process for testing
process.env.PORT = '3000';
const app = require('./index');

async function runTests() {
  // Give the server a moment to start
  await new Promise((r) => setTimeout(r, 500));

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ ${name}: ${err.message}`);
      failed++;
    }
  }

  console.log('\nRunning tests...\n');

  await test('GET / returns 200', async () => {
    const { status } = await get('/');
    assert.strictEqual(status, 200, `Expected 200, got ${status}`);
  });

  await test('GET /health returns 200 with status:healthy', async () => {
    const { status, body } = await get('/health');
    assert.strictEqual(status, 200);
    const json = JSON.parse(body);
    assert.strictEqual(json.status, 'healthy');
    assert.ok(json.timestamp, 'timestamp missing');
    assert.ok(typeof json.uptime === 'number', 'uptime should be a number');
  });

  await test('GET /info returns app metadata', async () => {
    const { status, body } = await get('/info');
    assert.strictEqual(status, 200);
    const json = JSON.parse(body);
    assert.strictEqual(json.app, 'devops-cicd-project');
    assert.ok(json.version, 'version missing');
    assert.ok(json.node, 'node version missing');
  });

  console.log(`\n${passed} passed, ${failed} failed\n`);

  if (failed > 0) process.exit(1);
  process.exit(0);
}

runTests().catch((err) => {
  console.error('Test runner crashed:', err);
  process.exit(1);
});
