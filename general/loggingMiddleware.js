const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', // Logi tase - info, error, warn, debug
  format: winston.format.json(), // Logi formaat - json, simple, prettyPrint
  defaultMeta: { service: 'blog' }, // Vaikimisi metaandmed
  transports: [ // Transpordid - kuhu logitakse
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Veateated
    new winston.transports.File({ filename: 'logs/combined.log' }), // Kõik logid
  ],
});

const loggingMiddleware = (req, res, next) => {
  logger.log({
    level: 'info',
    message: `${req.method} ${req.url} ${new Date().toISOString()}`,
  });
  next();
};

module.exports = { loggingMiddleware };
