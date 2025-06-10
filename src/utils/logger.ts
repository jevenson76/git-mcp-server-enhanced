import winston from 'winston';
import { config } from '../config/index.js';

// Create a custom silent transport that does nothing
class SilentTransport extends winston.transports.Stream {
  constructor(opts?: winston.transports.StreamTransportOptions) {
    super(opts);
  }

  log(info: any, callback: () => void) {
    // Do nothing - just call callback immediately
    if (callback) {
      setImmediate(callback);
    }
  }
}

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
  // Use custom silent transport
  transports.push(new SilentTransport());
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
