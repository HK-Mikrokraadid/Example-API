const hashService = require('../general/hashService');
const db = require('../db');

const getAllUsers = async () => {
  const [rows] = await db.query(
    `SELECT
        firstName, lastName, email, created_at
      FROM
        users
      WHERE
        deleted_at IS NULL`);
  return rows;
};

const getUserById = async (id) => {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ? AND deleted_at IS NULL', [id]);
  return rows[0];
};

const createUser = async (user) => {
  const hashedPassword = await hashService.hashPassword(user.password);
  const [result] = await db.query('INSERT INTO users SET ?', { ...user, password: hashedPassword });
  const id = result.insertId;
  return id;
};

const getUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND deleted_at IS NULL', [email]);
  return rows[0];
};

module.exports = {
  getUserById, getAllUsers, createUser, getUserByEmail,
};
