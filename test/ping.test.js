const app = require('../src/app');
const request = require('supertest');
const { describe, it } = require('mocha');
const { expect } = require('chai');

describe('Ping endpoint', () => {
  describe('GET /ping', () => {
    it('Should return alive message', async () => {
      const response = await request(app).get('/ping');
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({
        success: true,
        message: 'API is alive and well!'
      });
    });
  });
});
