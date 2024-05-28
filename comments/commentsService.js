const comments = require('./comments');

const getAllComments = async () => comments;

const getCommentById = async (id) => {
  const comment = comments.find((comment) => comment.id === id);
  return comment;
};

const createComment = async (comment) => {
  const id = comments.length + 1;
  comment.id = id;
  comments.push(comment);
  return comment;
}

module.exports = { getAllComments, getCommentById, createComment };
