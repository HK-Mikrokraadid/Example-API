const usersService = require('../users/usersService');
const hashService = require('../general/hashService');
const jwtService = require('../general/jwtService');

const login = async (email, password) => {
  const user = await usersService.getUserByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }
  const isMatch = await hashService.comparePasswords(password, user.password);
  const payload = { id: user.id, email: user.email, role: user.role };
  const token = jwtService.generateToken(payload);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }
  return token;
};

module.exports = { login };
