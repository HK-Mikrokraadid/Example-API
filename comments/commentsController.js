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

const getCommentById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const comment = await commentsService.getCommentById(id);
    if (!comment) {
      const error = new Error('Comment not found');
      error.status = 404;
      throw error;
    }
    return res.status(200).json({
      success: true,
      message: 'Comment by id',
      comment,
    });
  } catch (error) {
    return next(error);
  }
};

const createComment = async (req, res, next) => {
  try {
    const { name, email, body, postId } = req.body;
    if (!name || !email || !body || !postId) {
      const error = new Error('name, email, body and postId are required');
      error.status = 400;
      throw error;
    }
    const comment = {
      name,
      email,
      body,
      post_id: postId,
    };
    const id = await commentsService.createComment(comment);
    return res.status(201).json({
      success: true,
      message: 'comment created',
      id,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getAllComments, getCommentById, createComment };
