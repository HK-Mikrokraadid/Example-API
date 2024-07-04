const request = require('supertest');
const app = require('../app');
const { describe, it, before } = require('mocha');
const { expect } = require('chai');
const { setupTestDatabase } = require('../testDbSetup');

let adminToken;
let userToken;
let userId;

const admin = {
  id: 1,
  email: 'admin@admin.ee',
  password: 'admin',
};

const user = {
  id: 2,
  email: 'user@user.ee',
  password: 'user',
};

before(async () => {
  await setupTestDatabase();

  let response = await request(app)
    .post('/login')
    .send(admin);
  adminToken = response.body.token;

  response = await request(app)
    .post('/login')
    .send(user);
  userToken = response.body.token;
});

describe('Users endpoint', () => {
  describe('POST /users', () => {
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
      userId = res.body.id;
    });

    it('should fail to create a user with existing email', async () => {
      const res = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'securepass123'
        });
      expect(res.status).to.equal(409);
      expect(res.body).to.deep.equal({
        success: false,
        message: 'User already exists',
      });
    });

    it('should fail to create a user with missing fields', async () => {
      const res = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          firstName: 'John',
        });
      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({
        success: false,
        message: 'First name, last name, email and password are required',
      });
    });
  });

  describe('GET /users', () => {
    it('should get all users', async () => {
      const res = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).to.equal(200);
      expect(res.body.users).to.be.an('array');
    });
  });

  describe('GET /users/:id', () => {
    it('should get a user by id', async () => {
      const res = await request(app)
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).to.equal(200);
      expect(res.body.user).to.have.property('email', 'john.doe@example.com');
    });

    it('should fail to get a user with non-existing id', async () => {
      const res = await request(app)
        .get('/users/999')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({
        success: false,
        message: 'User not found',
      });
    });

    it('should fail to get a user by id if not admin or self', async () => {
      const res = await request(app)
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).to.equal(403);
      expect(res.body).to.deep.equal({
        success: false,
        message: 'Unauthorized',
      });
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update a user', async () => {
      const res = await request(app)
        .patch(`/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          firstName: 'Jane',
        });
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({
        success: true,
        message: 'User updated',
      });
    });

    it('should fail to update a user with invalid role', async () => {
      const res = await request(app)
        .patch(`/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          role: 'invalidRole',
        });
      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({
        success: false,
        message: 'Role must be admin or user',
      });
    });

    it('should fail to update other user if not admin and changing role to admin', async () => {
      const res = await request(app)
        .patch(`/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          role: 'admin',
        });
      expect(res.status).to.equal(403);
      expect(res.body).to.deep.equal({
        success: false,
        message: 'Unauthorized',
      });
    });

    it('should fail to update a user if not admin and changing role to admin', async () => {
      const res = await request(app)
        .patch(`/users/${user.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          role: 'admin',
        });
      expect(res.status).to.equal(403);
      expect(res.body).to.deep.equal({
        success: false,
        message: 'Unauthorized',
      });
    });

    it('should fail to update a user with missing fields', async () => {
      const res = await request(app)
        .patch(`/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});
      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({
        success: false,
        message: 'First name, last name, email or password are required',
      });
    });

    it('should fail to update a user with non-existing id', async () => {
      const res = await request(app)
        .patch('/users/999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          firstName: 'Jane',
        });
      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({
        success: false,
        message: 'User not found',
      });
    });
  });

  describe('DELETE /users/:id', () => {
    it('should fail to delete a user if not admin or self', async () => {
      const res = await request(app)
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).to.equal(403);
      expect(res.body).to.deep.equal({
        success: false,
        message: 'Unauthorized',
      });
    });
    it('should delete a user', async () => {
      const res = await request(app)
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({
        success: true,
        message: 'User deleted',
      });
    });

    it('should fail to delete a user with non-existing id', async () => {
      const res = await request(app)
        .delete('/users/999')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({
        success: false,
        message: 'User not found',
      });
    });
  });
});
