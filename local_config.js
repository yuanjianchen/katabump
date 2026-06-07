const path = require('path');

function resolveChromePath({ env = process.env, platform = process.platform } = {}) {
    if (env.CHROME_PATH && env.CHROME_PATH.trim()) {
        return env.CHROME_PATH;
    }

    if (platform === 'darwin') {
        return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    }

    if (platform === 'win32') {
        return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    }

    return env.CHROME_BIN || '/usr/bin/google-chrome';
}

function resolveUserDataDir({ env = process.env, baseDir = __dirname } = {}) {
    if (env.CHROME_USER_DATA_DIR && env.CHROME_USER_DATA_DIR.trim()) {
        return env.CHROME_USER_DATA_DIR;
    }

    return path.join(baseDir, 'ChromeData_Katabump');
}

function resolveHeadless(env = process.env) {
    const raw = env.HEADLESS;
    if (raw === undefined || raw === null || raw === '') {
        return false;
    }

    return /^(1|true|yes|on)$/i.test(String(raw));
}

function resolveDebugPort(env = process.env) {
    const raw = env.DEBUG_PORT;
    if (raw === undefined || raw === null || raw === '') {
        return 9222;
    }

    const port = Number(raw);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error(`Invalid DEBUG_PORT: ${raw}`);
    }

    return port;
}

function safeUsername(username) {
    return String(username).replace(/[^a-z0-9]/gi, '_');
}

function createRunTracker() {
    const successes = [];
    const failures = [];

    return {
        markSuccess(username, reason) {
            successes.push({ username, reason });
        },
        markFailure(username, reason) {
            failures.push({ username, reason });
        },
        summary() {
            return {
                successCount: successes.length,
                failureCount: failures.length,
                failures: failures.map(({ username, reason }) => ({ username, reason })),
            };
        },
        exitCode() {
            return failures.length === 0 ? 0 : 1;
        },
    };
}

module.exports = {
    resolveChromePath,
    resolveUserDataDir,
    resolveHeadless,
    resolveDebugPort,
    safeUsername,
    createRunTracker,
};
