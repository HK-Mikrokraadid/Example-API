const jwt = require('jsonwebtoken');
const config = require('../../config');

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
    error.status = 401;
    error.message = 'Invalid token';
    throw error;
  }
};

module.exports = { generateToken, verifyToken };
