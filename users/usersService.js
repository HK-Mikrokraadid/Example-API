const hashService = require('../general/hashService');
const db = require('../db');

const getAllUsers = async () => {
  try {
    const [rows] = await db.query(
      `SELECT
        firstName, lastName, email, created_at
      FROM
        users
      WHERE
        deleted_at IS NULL`);
    return rows;
  } catch (error) {
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ? AND deleted_at IS NULL', [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

const createUser = async (user) => {
  try {
    const hashedPassword = await hashService.hashPassword(user.password);
    const [result] = await db.query('INSERT INTO users SET ?', { ...createdUser, password: hashedPassword });
    const id = result.insertId;
    return id;
  } catch (error) {
    throw error;
  }

};

const getUserByEmail = async (email) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND deleted_at IS NULL', [email]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getUserById, getAllUsers, createUser, getUserByEmail,
};
