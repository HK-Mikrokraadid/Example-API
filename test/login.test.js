const request = require('supertest');
const app = require('../app');
const { describe, it } = require('mocha');
const { expect } = require('chai');

const user = {
  email: 'user@user.ee',
  password: 'user',
};

const admin = {
  email: 'admin@admin.ee',
  password: 'admin',
};

const nonExistingUser = {
  email: 'non@existing.ee',
  password: 'something',
};

describe('Login endpoint', async () => {
  it('Should fail login with invalid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send(nonExistingUser);
    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({
      success: false,
      message: 'Invalid email or password',
    });
  });
  it('Should login successfully with user credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send(user);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('token');
  });
  it('Should login successfully with admin credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send(admin);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('token');
  });
});