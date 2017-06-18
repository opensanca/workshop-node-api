import mongoose from 'mongoose';
import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../index';

chai.config.includeStack = true;

describe('## User APIs', () => {
  let user = {
    username: 'someone',
    password: '1234567890'
  };

  describe('# POST /api/users', () => {
    it('should create a new user', (done) => {
      request(app)
        .post('/api/users')
        .send(user)
        .then((res) => {
          expect(res.body.data.username).to.equal(user.username);
          user = res.body.data;
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/users/:userId', () => {
    it('should get user details', (done) => {
      request(app)
        .get(`/api/users/${user._id}`)
        .then((res) => {
          expect(res.body.data.username).to.equal(user.username);
          expect(res.statusCode).to.equal(httpStatus.OK);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when user does not exists', (done) => {
      request(app)
        .get('/api/users/59466cf3da73f560a5f9b9d')
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          expect(res.statusCode).to.equal(httpStatus.NOT_FOUND);
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /api/users/:userId', () => {
    it('should update user details', (done) => {
      user.username = 'kk';
      request(app)
        .put(`/api/users/${user._id}`)
        .send(user)
        .then((res) => {
          expect(res.body.data.username).to.equal('kk');
          expect(res.statusCode).to.equal(httpStatus.OK);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/users/', () => {
    it('should get all users', (done) => {
      request(app)
        .get('/api/users')
        .then((res) => {
          expect(res.body.data).to.be.an('array');
          expect(res.statusCode).to.equal(httpStatus.OK);
          done();
        })
        .catch(done);
    });

    it('should get all users (with limit and skip)', (done) => {
      request(app)
        .get('/api/users')
        .query({ limit: 10, skip: 1 })
        .then((res) => {
          expect(res.body.data).to.be.an('array');
          expect(res.statusCode).to.equal(httpStatus.OK);
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/users/', () => {
    it('should delete user', (done) => {
      request(app)
        .delete(`/api/users/${user._id}`)
        .then((res) => {
          expect(res.body.data.username).to.equal('kk');
          expect(res.statusCode).to.equal(httpStatus.OK);
          done();
        })
        .catch(done);
    });
  });
});