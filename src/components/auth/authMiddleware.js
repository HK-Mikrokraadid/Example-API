const jwtService = require('../general/jwtService');

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      const error = new Error('Token is required');
      error.status = 401;
      throw error;
    }
    const payload = await jwtService.verifyToken(token);
    res.locals.user = payload;
    return next();
  } catch (error) {
    return next(error);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const role = res.locals.user?.role;
    if (role !== 'admin') {
      const error = new Error('Unauthorized');
      error.status = 403;
      throw error;
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { isLoggedIn, isAdmin };
