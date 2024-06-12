const authService = require('./authService');

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.status = 400;
    return next(error);
  }
  const token = await authService.login(email, password);
  if (!token) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    return next(error);
  }
  return res.status(200).json({
    success: true,
    message: 'Logged in',
    token,
  });
};

module.exports = { login };
