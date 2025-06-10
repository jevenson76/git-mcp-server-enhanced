import winston from 'winston';
import { config } from '../config/index.js';

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

export const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  transports: [
    new winston.transports.Console(),
  ],
});

// Add error handling
logger.on('error', (error) => {
  console.error('Logger error:', error);
});
