const authService = require('./authService');

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }
  const token = await authService.login(email, password);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }
  return res.status(200).json({
    success: true,
    message: 'Logged in',
    token,
  });
};

module.exports = { login };
