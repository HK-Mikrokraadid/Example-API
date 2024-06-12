const logger = require('./logger');

// eslint-disable-next-line no-unused-vars
const notFound = (req, res, next) => {
  res.status(404).send({
    success: false,
    message: 'Route not found',
  });
};

const errorHandling = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });
  // console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}

module.exports = { notFound, errorHandling };
