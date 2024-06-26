const postsService = require('./postsService');

const getAllPosts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { posts, total } = await postsService.getAllPosts(page, limit);
    return res.status(200).json({
      success: true,
      message: 'All posts',
      posts,
      pagination: {
        totalPages: Math.ceil(total / limit),
        itemsPerPage: limit,
        currentPage: page,
        totalItems: total,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const post = await postsService.getPostById(id);
    if (!post) {
      const error = new Error('Post not found');
      error.status = 404;
      throw error;
    }
    return res.status(200).json({
      success: true,
      message: 'Post by id',
      post,
    });
  } catch (error) {
    return next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) {
      const error = new Error('title and body are required');
      error.status = 400;
      throw error;
    }
    const userId = res.locals.user.id;
    const post = {
      title, body, user_id: userId,
    };
    const id = await postsService.createPost(post);
    return res.status(201).json({
      success: true,
      message: 'Post created',
      id,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getAllPosts, getPostById, createPost };
