const db = require('../db');

const getAllPosts = async (page, limit) => {
  const offset = (page - 1) * limit;
  // Select total of posts
  const [total] = await db.query('SELECT COUNT(*) as total FROM posts WHERE deleted_at IS NULL;');
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
      LIMIT ? OFFSET ?;
      `, [limit, offset]);
  return { posts: rows, total: total[0].total };
};

const getPostById = async (id) => {
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
      WHERE p.deleted_at IS NULL AND p.id = ?;`, [id]);
  return rows[0];
};

const createPost = async (post) => {
  const [result] = await db.query('INSERT INTO posts SET ?;', [post]);
  return result.insertId;
};

const updatePost = async (id, post) => {
  const [result] = await db.query('UPDATE posts SET ? WHERE id = ?;', [post, id]);
  return result.affectedRows;
};

const deletePost = async (id) => {
  const [result] = await db.query('UPDATE posts SET deleted_at = NOW() WHERE id = ?;', [id]);
  return result.affectedRows;
};

module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost };
