const request = require('supertest');
const app = require('../app');
const { describe, it, before } = require('mocha');
const { expect } = require('chai');
const { setupTestDatabase } = require('../testDbSetup');


let userToken;
let adminToken;
let userId;

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

describe('Users', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'securepass123'
      });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    userId=res.body.id;
  });

  it('should get all users', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).to.equal(200);
    expect(res.body.users).to.be.an('array');
  });

  it('should get a user by id', async () => {
    console.log(userId);
    const res = await request(app)
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).to.equal(200);
    expect(res.body.user).to.have.property('email', 'john.doe@example.com');
  });
});