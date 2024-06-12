const comments = require('./comments');

const getAllComments = async () => {
  try {
    return comments;
  } catch (error) {
    throw error;
  }
};

const getCommentById = async (id) => {
  try {
    const comment = comments.find((comment) => comment.id === id);
    return comment;
  } catch (error) {
    throw error;
  }
};

const createComment = async (comment) => {
  const id = comments.length + 1;
  comment.id = id;
  comments.push(comment);
  return comment;
}

module.exports = { getAllComments, getCommentById, createComment };
