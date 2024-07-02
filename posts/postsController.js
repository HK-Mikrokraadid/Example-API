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
};

const updatePost = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const post = await postsService.getPostById(id);
    if (!post) {
      const error = new Error('Post not found');
      error.status = 404;
      throw error;
    }
    if (post.user_id !== res.locals.user.id) {
      const error = new Error('You are not authorized to update this post');
      error.status = 401;
      throw error;
    }
    const { title, body } = req.body;
    if (!title && !body) {
      const error = new Error('Title or body are required');
      error.status = 400;
      throw error;
    }
    const updatedPost = { 
      title: title || post.title,
      body: body || post.body,
    };
    await postsService.updatePost(id, updatedPost);
    return res.status(200).json({
      success: true,
      message: 'Post updated',
    });
  } catch (error) {
    return next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const post = await postsService.getPostById(id);
    if (!post) {
      const error = new Error('Post not found');
      error.status = 404;
      throw error;
    }
    if (post.user_id !== res.locals.user.id) {
      const error = new Error('You are not authorized to delete this post');
      error.status = 401;
      throw error;
    }
    await postsService.deletePost(id);
    return res.status(200).json({
      success: true,
      message: 'Post deleted',
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost };
