const commentsService = require('./commentsService');

const getAllComments = async (req, res, next) => {
  try {
    const comments = await commentsService.getAllComments();
    return res.status(200).json({
      success: true,
      message: 'All comments',
      comments,
    });
  } catch (error) {
    return next(error);
  }
};

const getCommentById = async (req, res) => {
  const id = Number(req.params.id);
  const comment = await commentsService.getCommentById(id);
  if (!comment) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found',
    });
  }
  return res.status(200).json({
    success: true,
    message: 'Comment by id',
    comment,
  });
};

const createComment = async (req, res) => {
  const { name, email, body, postId } = req.body;
  const newComment = await commentsService.createComment({ name, email, body, postId });
  return res.status(201).json({
    success: true,
    message: 'comment created',
    comment: newComment,
  });
}

module.exports = { getAllComments, getCommentById, createComment };
