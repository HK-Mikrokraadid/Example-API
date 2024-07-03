const { createLogger, format, transports } = require('winston');
const { combine, timestamp, errors, json } = format;
// const WinstonLogStash = require('winston3-logstash-transport');
const LogstashTransport = require("winston-logstash/lib/winston-logstash-latest");

// Kohandatud logi formaat
/* const logFormat = printf(({ level, message, timestamp, stack }) => {
  console.log('Message from logger:', message);
  return `${timestamp} ${level}: ${stack || message}`;
}); */

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    errors({ stack: true }), // Logi veateated koos stack trace'iga
    json(),
    format((info) => {
      info.service = { name: 'Example blog API' };
      return info;
    })()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: './logs/combined.log' }),
    new transports.File({ filename: './logs/errors.log', level: 'error' }),
    new LogstashTransport({
      mode: 'tcp',
      host: '10.168.10.225',
      port: 50000,
      ssl_enable: false,
      max_connect_retries: -1,
      timeout_connect_retries: 1000,
      onError: (error) => console.error('Logstash error:', error)
    }),
  ],
});

module.exports = logger;
