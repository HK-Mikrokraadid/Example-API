const jwt = require('jsonwebtoken');
const config = require('../config');

const secret = config.jwtSecret;

const generateToken = async (payload) => {
  const token = await jwt.sign(payload, secret, { expiresIn: '1h' });
  return token;
};

const verifyToken = async (token) => {
  try {
    const payload = jwt.verify(token, secret);
    return payload;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error.message);
    throw error;
  }
};

module.exports = { generateToken, verifyToken };
