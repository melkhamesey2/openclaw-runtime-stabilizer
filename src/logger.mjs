import fs from 'node:fs';
import path from 'node:path';

const LEVEL_RANK = {
  debug: 10,
  info: 20,
  warning: 30,
  error: 40,
};

function normalizeLevel(level) {
  const value = String(level || 'info').toLowerCase();
  return LEVEL_RANK[value] ? value : 'info';
}

function ensureParent(filePath) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
}

function safeStringify(record) {
  return JSON.stringify(record, (_key, value) => {
    if (value instanceof Error) {
      return { name: value.name, message: value.message, stack: value.stack };
    }
    return value;
  });
}

export function createLogger(options = {}) {
  const logFile = options.logFile || null;
  const minLevel = normalizeLevel(options.level || process.env.OPENCLAW_STABILIZER_LOG_LEVEL || 'info');
  const consoleEnabled = options.console !== false;
  const fileEnabled = Boolean(logFile);

  if (fileEnabled) ensureParent(logFile);

  function shouldLog(level) {
    return LEVEL_RANK[normalizeLevel(level)] >= LEVEL_RANK[minLevel];
  }

  function write(level, message, data = {}) {
    const normalized = normalizeLevel(level);
    if (!shouldLog(normalized)) return;

    const record = {
      timestamp: new Date().toISOString(),
      level: normalized.toUpperCase(),
      message,
      ...data,
    };

    const line = safeStringify(record);

    if (consoleEnabled) {
      const stream = normalized === 'error' || normalized === 'warning' ? process.stderr : process.stdout;
      stream.write(`${line}\n`);
    }

    if (fileEnabled) {
      fs.appendFileSync(logFile, `${line}\n`, 'utf8');
    }
  }

  return {
    debug: (message, data) => write('debug', message, data),
    info: (message, data) => write('info', message, data),
    warning: (message, data) => write('warning', message, data),
    error: (message, data) => write('error', message, data),
  };
}
