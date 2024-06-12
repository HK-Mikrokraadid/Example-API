const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', // Logi tase - info, error, warn, debug
  format: winston.format.json(), // Logi formaat - json, simple, prettyPrint
  defaultMeta: { service: 'blog' }, // Vaikimisi metaandmed
  transports: [ // Transpordid - kuhu logitakse
    new winston.transports.File({ filename: 'error.log', level: 'error' }), // Veateated
    new winston.transports.File({ filename: 'combined.log' }), // Kõik logid
  ],
});

// eslint-disable-next-line no-unused-vars
const notFound = (req, res, next) => {
  res.status(404).send({
    success: false,
    message: 'Route not found',
  });
};

const errorHandling = (err, req, res, next) => {
  logger.log({
    level: 'error',
    message: `${req.method} ${req.url} ${err.message} ${new Date().toISOString()}`,
  });
  // console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}

module.exports = { notFound, errorHandling };
