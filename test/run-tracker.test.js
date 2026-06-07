const test = require('node:test');
const assert = require('node:assert/strict');
const { createRunTracker } = require('../local_config');

test('run tracker exits successfully only when all users reached decisive success', () => {
  const tracker = createRunTracker();
  tracker.markSuccess('first@example.com', 'renewed');

  assert.equal(tracker.exitCode(), 0);
  assert.deepEqual(tracker.summary(), {
    successCount: 1,
    failureCount: 0,
    failures: [],
  });
});

test('run tracker exits non-zero when any user has an undecided or failed result', () => {
  const tracker = createRunTracker();
  tracker.markSuccess('ok@example.com', 'not yet renewable');
  tracker.markFailure('bad@example.com', 'server entry link not found');

  assert.equal(tracker.exitCode(), 1);
  assert.deepEqual(tracker.summary(), {
    successCount: 1,
    failureCount: 1,
    failures: [{ username: 'bad@example.com', reason: 'server entry link not found' }],
  });
});
