const jwtService = require('../general/jwtService');

const isLoggedIn = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token is required',
    });
  }
  try {
    const payload = await jwtService.verifyToken(token);
    if (!payload) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
    res.locals.user = payload;
    return next();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
};

const isAdmin = async (req, res, next) => {
  const { role } = res.locals.user;
  if (!role) {
    return res.status(401).json({
      success: false,
      message: 'You need to be logged in to access this route',
    });
  }
  if (role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized',
    });
  }
  return next();
};

module.exports = { isLoggedIn, isAdmin };
