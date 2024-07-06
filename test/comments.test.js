const request = require('supertest');
const app = require('../src/app');
const { describe, it, before } = require('mocha');
const { expect } = require('chai');
const { setupTestDatabase } = require('../src/testDbSetup');

let userToken;

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

describe('Comments endpoint', () => {
  describe('GET /comments', () => {
    it('Should fail to receive comments because of no token', async () => {
      const response = await request(app)
        .get('/comments');
      expect(response.status).to.equal(401);
      expect(response.body).to.deep.equal({
        success: false,
        message: 'Token is required',
      });
    });

    it('Should get array of comments', async () => {
      const response = await request(app)
        .get('/comments')
        .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('comments');
      expect(response.body.comments).to.be.an('array');
      expect(response.body.comments.length).to.be.gt(5);
    });
  });

  describe('POST /comments', () => {
    it('Should create a comment', async () => {
      const response = await request(app)
        .post('/comments')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Test Commenter',
          email: 'test@commenter.com',
          body: 'This is a test comment',
          postId: 1
        });
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('id');
    });

    it('Should fail to create a comment without required fields', async () => {
      const response = await request(app)
        .post('/comments')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Test Commenter',
          email: 'test@commenter.com'
        });
      expect(response.status).to.equal(400);
      expect(response.body).to.deep.equal({
        success: false,
        message: 'name, email, body and postId are required',
      });
    });
  });

  describe('GET /comments/:id', () => {
    it('Should get comment by id', async () => {
      const response = await request(app)
        .get('/comments/1')
        .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('comment');
    });

    it('Should return 404 for non-existing comment id', async () => {
      const response = await request(app)
        .get('/comments/999')
        .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({
        success: false,
        message: 'Comment not found',
      });
    });
  });

  describe('GET /post/:postId/comments', () => {
    it('Should get comments by post id', async () => {
      const response = await request(app)
        .get('/posts/1/comments')
        .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('comments');
      expect(response.body.comments).to.be.an('array');
    });

    it('Should return 404 for non-existing post id', async () => {
      const response = await request(app)
        .get('/posts/999/comments')
        .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({
        success: false,
        message: 'Post not found',
      });
    });
  });
});
