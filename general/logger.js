const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, errors } = format;

// Kohandatud logi formaat
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    errors({ stack: true }), // Logi veateated koos stack trace'iga
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: './logs/combined.log' }),
    new transports.File({ filename: './logs/errors.log', level: 'error' }),
  ],
});

module.exports = logger;
