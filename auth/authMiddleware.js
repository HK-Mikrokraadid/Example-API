const jwtService = require('../general/jwtService');

const isLoggedIn = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    const error = new Error('Token is required');
    error.status = 401;
    return next(error);
  }
  try {
    const payload = await jwtService.verifyToken(token);
    if (!payload) {
      const error = new Error('Invalid token');
    error.status = 401;
    return next(error);
    }
    res.locals.user = payload;
    return next();
  } catch (error) {
    error.status = 401;
    return next(error);
  }
};

const isAdmin = async (req, res, next) => {
  const role = res.locals.user?.role;
  if (!role) {
    const error = new Error('You need to be logged in to access this route');
    error.status = 401;
    return next(error);
  }
  if (role !== 'admin') {
    const error = new Error('Unauthorized');
    error.status = 403;
    return next(error);
  }
  return next();
};

module.exports = { isLoggedIn, isAdmin };
