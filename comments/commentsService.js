const comments = require('./comments');
const db = require('../db');


const getAllComments = async () => {
  try {
    const [rows] = await db.query('SELECT * FROM comments WHERE deleted_at IS NULL');
    return rows;
  } catch (error) {
    throw error;
  }
};

const getCommentById = async (id) => {
  try {
    const [rows] = await db.query('SELECT * FROM comments WHERE id = ? AND deleted_at IS NULL', [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

const createComment = async (comment) => {
  try {
    const [result] = await db.query('INSERT INTO comments SET ?', comment);
    const id = result.insertId;
    return id;
  } catch (error) {
    throw error;
  }
}

module.exports = { getAllComments, getCommentById, createComment };
