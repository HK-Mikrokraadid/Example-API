const request = require('supertest');
const app = require('../app');
const { describe, it, before } = require('mocha');
const { expect } = require('chai');

let userToken;

const user = {
  email: 'user@user.ee',
  password: 'user',
};

const admin = {
  email: 'admin@admin.ee',
  password: 'admin',
};

before(async () => {
  const response = await request(app)
    .post('/login')
    .send(user);
  userToken = response.body.token;
});

describe('Posts endpoint', async () => {
  it('Should fail to receive postst because of no token', async () => {
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