const db = require('../db');

const getAllPosts = async (from, limit) => {
  try {
    // select from posts using from and limit

    const [rows] = await db.query(`
      SELECT
        u.firstName,
        u.lastName,
        u.email,
        p.id,
        p.title,
        p.body,
        p.created_at,
        p.updated_at
      FROM posts p
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.deleted_at IS NULL
      ORDER BY p.created_at DESC
      LIMIT ?, ?;
      `, [from, limit]);
    return rows;
  } catch (error) {
    throw error;
  }
};

const getPostById = async (id) => {
  try {
    const [rows] = await db.query(`
      SELECT
        u.firstName,
        u.lastName,
        u.email,
        p.id,
        p.title,
        p.body,
        p.created_at,
        p.updated_at
      FROM posts p
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.deleted_at IS NULL AND id = ?;`, [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

const createPost = async (post) => {
  try {
    const [result] = await db.query('INSERT INTO posts ?', post);
    return result.insertId;
  } catch (error) {
    throw error;
  }
}

module.exports = { getAllPosts, getPostById, createPost };
