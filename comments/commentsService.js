const db = require('../db');


const getAllComments = async () => {
  const [rows] = await db.query('SELECT * FROM comments WHERE deleted_at IS NULL');
  return rows;
};

const getCommentById = async (id) => {
  const [rows] = await db.query('SELECT * FROM comments WHERE id = ? AND deleted_at IS NULL', [id]);
  return rows[0];
};

const createComment = async (comment) => {
  const [result] = await db.query('INSERT INTO comments SET ?', comment);
  const id = result.insertId;
  return id;
};

const getPostComments = async (postId) => {
  const [rows] = await db.query('SELECT * FROM comments WHERE post_id = ? AND deleted_at IS NULL', [postId]);
  return rows;
};

module.exports = { getAllComments, getCommentById, createComment, getPostComments };
