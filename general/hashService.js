const bcrypt = require('bcrypt');
const config = require('../config');

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, config.saltRounds);
  return hashedPassword;
};

const comparePasswords = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

module.exports = { hashPassword, comparePasswords };
