/* eslint-disable no-undef */
require('dotenv').config();

const config = {
  development: {
    port: Number(process.env.PORT) || 3000,
    jwtSecret: process.env.JWT_SECRET,
    saltRounds: Number(process.env.SALT_ROUNDS) || 10,
    db: {
      host: process.env.MYSQL_HOST,
      database: process.env.MYSQL_DATABASE,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      port: Number(process.env.MYSQL_PORT),
    },
  },
  test: {
    port: Number(process.env.PORT) || 3000,
    jwtSecret: process.env.JWT_SECRET || 'secret-secret',
    saltRounds: Number(process.env.SALT_ROUNDS) || 10,
    db: {
      host: process.env.MYSQL_TEST_HOST,
      database: process.env.MYSQL_TEST_DATABASE,
      user: process.env.MYSQL_TEST_USER,
      password: process.env.MYSQL_TEST_PASSWORD,
      port: Number(process.env.MYSQL_TEST_PORT),
    },
  },
};

const env = process.env.NODE_ENV || 'development';

module.exports = config[env];
