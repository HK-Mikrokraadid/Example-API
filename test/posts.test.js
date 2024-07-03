const request = require('supertest');
const app = require('../app');
const { describe, it, before } = require('mocha');
const { expect } = require('chai');
const { setupTestDatabase } = require('../testDbSetup');

let userToken;
let postId;

const user = {
  email: 'user@user.ee',
  password: 'user',
};

before(async () => {
  await setupTestDatabase();

  const response = await request(app)
    .post('/login')
    .send(user);
  userToken = response.body.token;
});

describe('Posts endpoint', () => {
  describe('GET /posts', () => {
    it('Should fail to receive posts because of no token', async () => {
      const response = await request(app)
        .get('/posts');
      expect(response.status).to.equal(401);
      expect(response.body).to.deep.equal({
        success: false,
        message: 'Token is required',
      });
    });

    it('Should get array of posts', async () => {
      const response = await request(app)
        .get('/posts')
        .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('posts');
      expect(response.body.posts).to.be.an('array');
      expect(response.body.posts.length).to.be.gt(5);
    });
  });

  describe('POST /posts', () => {
    it('Should create a post', async () => {
      const response = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Test Post',
          body: 'This is a test post'
        });
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('id');
      postId = response.body.id;
    });

    it('Should fail to create a post without required fields', async () => {
      const response = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Test Post'
        });
      expect(response.status).to.equal(400);
      expect(response.body).to.deep.equal({
        success: false,
        message: 'Title and body are required',
      });
    });
  });

  describe('GET /posts/:id', () => {
    it('Should get post by id', async () => {
      const response = await request(app)
        .get(`/posts/${postId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('post');
    });

    it('Should return 404 for non-existing post id', async () => {
      const response = await request(app)
        .get('/posts/999')
        .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({
        success: false,
        message: 'Post not found',
      });
    });
  });

  describe('PATCH /posts/:id', () => {
    it('Should update a post', async () => {
      const response = await request(app)
        .patch(`/posts/${postId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Updated Title'
        });
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({
        success: true,
        message: 'Post updated',
      });
    });

    it('Should fail to update a post if not the owner', async () => {
      const anotherUserToken = (await request(app).post('/login').send({
        email: 'another@user.ee',
        password: 'another'
      })).body.token;

      const response = await request(app)
        .patch(`/posts/${postId}`)
        .set('Authorization', `Bearer ${anotherUserToken}`)
        .send({
          title: 'Updated Title'
        });
      expect(response.status).to.equal(401);
      expect(response.body).to.deep.equal({
        success: false,
        message: 'You are not authorized to update this post',
      });
    });

    it('Should return 404 for updating non-existing post id', async () => {
      const response = await request(app)
        .patch('/posts/999')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Updated Title'
        });
      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({
        success: false,
        message: 'Post not found',
      });
    });

    it('Should fail to update a post with missing fields', async () => {
      const response = await request(app)
        .patch(`/posts/${postId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({});
      expect(response.status).to.equal(400);
      expect(response.body).to.deep.equal({
        success: false,
        message: 'Title or body are required',
      });
    });
  });

  describe('DELETE /posts/:id', () => {
    it('Should delete a post', async () => {
      const response = await request(app)
        .delete(`/posts/${postId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({
        success: true,
        message: 'Post deleted',
      });
    });

    it('Should fail to delete a post if not the owner', async () => {
      const anotherUserToken = (await request(app).post('/login').send({
        email: 'another@user.ee',
        password: 'another'
      })).body.token;

      const response = await request(app)
        .delete(`/posts/${postId}`)
        .set('Authorization', `Bearer ${anotherUserToken}`);
      expect(response.status).to.equal(401);
      expect(response.body).to.deep.equal({
        success: false,
        message: 'You are not authorized to delete this post',
      });
    });

    it('Should return 404 for deleting non-existing post id', async () => {
      const response = await request(app)
        .delete('/posts/999')
        .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({
        success: false,
        message: 'Post not found',
      });
    });
  });
});
