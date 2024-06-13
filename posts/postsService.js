const db = require('../db');

const getAllPosts = async () => {
  try {
    const [rows] = await db.query('SELECT * FROM posts WHERE deleted_at IS NULL');
    return rows;
  } catch (error) {
    throw error;
  }
};

const getPostById = async (id) => {
  try {
    const [rows] = await db.query('SELECT * FROM posts WHERE id = ? AND deleted_at IS NULL', [id]);
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
