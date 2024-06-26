const request = require('supertest');
const app = require('../app');
const { describe, it, before } = require('mocha');
const { expect } = require('chai');
const { setupTestDatabase } = require('../testDbSetup');


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
  await setupTestDatabase();

  const response = await request(app)
    .post('/login')
    .send(user);
  userToken = response.body.token;
});

describe('Comments endpoint', async () => {
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
