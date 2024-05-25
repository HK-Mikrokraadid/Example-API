const usersService = require('../users/usersService');
const hashService = require('../general/hashService');
const jwtService = require('../general/jwtService');

const login = async (email, password) => {
  const user = await usersService.getUserByEmail(email);
  if (!user) {
    return null;
  }
  const isMatch = await hashService.comparePasswords(password, user.password);
  const payload = { id: user.id, email: user.email, role: user.role };
  const token = jwtService.generateToken(payload);
  if (!isMatch) {
    return null;
  }
  return token;
};

module.exports = { login };
