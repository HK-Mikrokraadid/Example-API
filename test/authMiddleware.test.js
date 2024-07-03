const request = require('supertest');
const app = require('../app');
const { describe, it, before } = require('mocha');
const { expect } = require('chai');
const { setupTestDatabase } = require('../testDbSetup');

let userToken;
let adminToken;

const user = {
  email: 'user@user.ee',
  password: 'user',
};

const admin = {
  email: 'admin@admin.ee',
  password: 'admin',
};

before(async () => {
  await setupTestDatabase();

  let response = await request(app)
    .post('/login')
    .send(user);
  userToken = response.body.token;

  response = await request(app)
    .post('/login')
    .send(admin);
  adminToken = response.body.token;
});

describe('Auth Middleware', () => {
  describe('isLoggedIn', () => {
    it('should fail if no token is provided', async () => {
      const response = await request(app).get('/posts');
      expect(response.status).to.equal(401);
      expect(response.body).to.deep.equal({
        success: false,
        message: 'Token is required',
      });
    });

    it('should fail if an invalid token is provided', async () => {
      const response = await request(app)
        .get('/posts')
        .set('Authorization', 'Bearer invalidtoken');
      expect(response.status).to.equal(401);
      expect(response.body).to.deep.equal({
        success: false,
        message: 'Invalid token',
      });
    });

    it('should pass with a valid token', async () => {
      const response = await request(app)
        .get('/posts')
        .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).to.not.equal(401);
    });
  });

  describe('isAdmin', () => {
    it('should fail if the user is not logged in', async () => {
      const response = await request(app).get('/users');
      expect(response.status).to.equal(401);
      expect(response.body).to.deep.equal({
        success: false,
        message: 'Token is required',
      });
    });

    it('should fail if the user is not an admin', async () => {
      const response = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).to.equal(403);
      expect(response.body).to.deep.equal({
        success: false,
        message: 'Unauthorized',
      });
    });

    it('should pass if the user is an admin', async () => {
      const response = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(response.status).to.not.equal(401);
      expect(response.status).to.not.equal(403);
    });
  });
});
