const hashService = require('../general/hashService');
const db = require('../db');

const getAllUsers = async () => {
  const [rows] = await db.query(
    `SELECT
        id, firstName, lastName, email, role, created_at
      FROM
        users
      WHERE
        deleted_at IS NULL`);
  return rows;
};

const getUserById = async (id) => {
  const [rows] = await db.query('SELECT id, firstName, lastName, email, role, created_at FROM users WHERE id = ? AND deleted_at IS NULL', [id]);
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

const deleteUser = async (id) => {
  const [result] = await db.query('UPDATE users SET deleted_at = NOW() WHERE id = ?', [id]);
  return result.affectedRows;
};

const updateUser = async (id, user) => {
  const [result] = await db.query('UPDATE users SET ? WHERE id = ?', [user, id]);
  return result.affectedRows;
};

module.exports = {
  getUserById, getAllUsers, createUser, getUserByEmail, deleteUser, updateUser,
};
