const test = require('node:test');
const assert = require('node:assert/strict');
const {
  resolveChromePath,
  resolveHeadless,
  resolveDebugPort,
} = require('../local_config');

test('resolveChromePath uses explicit CHROME_PATH before platform defaults', () => {
  assert.equal(
    resolveChromePath({ env: { CHROME_PATH: '/custom/chrome' }, platform: 'darwin' }),
    '/custom/chrome'
  );
});

test('resolveChromePath returns macOS Chrome path on darwin', () => {
  assert.equal(
    resolveChromePath({ env: {}, platform: 'darwin' }),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  );
});

test('resolveHeadless keeps visible browser by default and accepts common truthy values', () => {
  assert.equal(resolveHeadless({}), false);
  assert.equal(resolveHeadless({ HEADLESS: '1' }), true);
  assert.equal(resolveHeadless({ HEADLESS: 'true' }), true);
  assert.equal(resolveHeadless({ HEADLESS: 'yes' }), true);
});

test('resolveDebugPort defaults to 9222 and rejects invalid values', () => {
  assert.equal(resolveDebugPort({}), 9222);
  assert.equal(resolveDebugPort({ DEBUG_PORT: '9333' }), 9333);
  assert.throws(() => resolveDebugPort({ DEBUG_PORT: 'not-a-port' }), /Invalid DEBUG_PORT/);
});

const { safeUsername } = require('../local_config');

test('safeUsername strips unsafe screenshot filename characters', () => {
  assert.equal(safeUsername('user.name+tag@example.com'), 'user_name_tag_example_com');
  assert.equal(safeUsername('../../evil'), '______evil');
});