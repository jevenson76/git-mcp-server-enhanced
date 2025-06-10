import winston from 'winston';
import { config } from '../config/index.js';
import { Writable } from 'stream';

// Create a no-op writable stream for silent logging
const nullStream = new Writable({
  write: (chunk, encoding, callback) => {
    callback();
  }
});

const logFormat = config.logging.format === 'pretty' ?
  winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
      return `${timestamp} [${level}]: ${message}${metaStr}`;
    })
  ) :
  winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  );

// When running as MCP server, use silent transport to avoid interfering with stdio
const transports = [];
if (process.env.MCP_MODE === 'stdio' || process.argv.includes('--stdio') || !process.env.GIT_MCP_WIZARD_DEBUG) {
  // Use stream transport with null stream for silent logging
  transports.push(new winston.transports.Stream({ stream: nullStream }));
} else {
  // Log to console for development
  transports.push(new winston.transports.Console());
}

export const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  transports,
});

// Add error handling
logger.on('error', () => {
  // Silently ignore logger errors
});
