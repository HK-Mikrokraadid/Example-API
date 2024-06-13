const authService = require('./authService');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.status = 400;
      throw error;
    }
    const token = await authService.login(email, password);
    if (!token) {
      const error = new Error('Invalid email or password');
      error.status = 401;
      throw error;
    }
    return res.status(200).json({
      success: true,
      message: 'Logged in',
      token,
    });
  } catch (error) {
    return next(error);
  }

};

module.exports = { login };
