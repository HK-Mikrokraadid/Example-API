const logger = require('./logger');
require('dotenv').config();

// eslint-disable-next-line no-unused-vars
const notFound = (req, res, next) => {
  res.status(404).send({
    success: false,
    message: 'Route not found',
  });
};

// eslint-disable-next-line no-unused-vars
const errorHandling = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });
  if (!err.status || err.status === 500) {
    err.message = 'Internal Server Error';
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}

module.exports = { notFound, errorHandling };
