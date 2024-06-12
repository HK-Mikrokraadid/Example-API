// eslint-disable-next-line no-unused-vars
const notFound = (req, res, next) => {
  res.status(404).send({
    success: false,
    message: 'Route not found',
  });
};

const errorHandling = (err, req, res, next) => {
  console.log('Error from errorHandling:');
  console.log(err.message);
  // console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}

module.exports = { notFound, errorHandling };
