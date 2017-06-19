import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import chai, { expect } from 'chai';
import app from '../../index';
import config from '../config/env';

chai.config.includeStack = true;

describe('## Auth APIs', () => {
  const validUserCredentials = {
    username: 'eita1234',
    password: 'eita1234'
  };

  const invalidUserCredentials = {
    username: 'react',
    password: 'IDontKnow'
  };

  let jwtToken;

  describe('# POST /api/auth/login', () => {
    it('should return Authentication error', (done) => {
      request(app)
        .post('/api/auth/login')
        .send(invalidUserCredentials)
        .then((res) => {
          expect(res.body.message).to.equal('Falha na autenticação. Usuário não encontrado.');
          done();
        })
        .catch(done);
    });

    it('should get valid JWT token', (done) => {
      request(app)
        .post('/api/auth/login')
        .send(validUserCredentials)
        .then((res) => {
          expect(res.body).to.have.property('token');
          expect(res.statusCode).to.equal(httpStatus.OK)
          jwt.verify(res.body.token, config.jwtSecret, (err, decoded) => {
            expect(err).to.not.be.ok; 
            //expect(decoded.username).to.equal(validUserCredentials.username);
            jwtToken = `Bearer ${res.body.token}`;
            done();
          });
        })
        .catch(done);
    });
  });

  describe('# GET /api/auth/random-number', () => {
    it('should fail to get random number because of missing Authorization', (done) => {
      request(app)
        .get('/api/auth/random-number')
        .then((res) => {
          expect(res.body.message).to.equal('Unauthorized');
          expect(res.statusCode).to.equal(httpStatus.UNAUTHORIZED)
          done();
        })
        .catch(done);
    });

    it('should fail to get random number because of wrong token', (done) => {
      request(app)
        .get('/api/auth/random-number')
        .set('Authorization', 'Bearer inValidToken')
        .then((res) => {
          expect(res.body.message).to.equal('Unauthorized');
          expect(res.statusCode).to.equal(httpStatus.UNAUTHORIZED)
          done();
        })
        .catch(done);
    });

    it('should get a random number', (done) => {
      request(app)
        .get('/api/auth/random-number')
        .set('Authorization', jwtToken)
        .then((res) => {
          expect(res.body.num).to.be.a('number');
          expect(res.statusCode).to.equal(httpStatus.OK)
          done();
        })
        .catch(done);
    });
  });
});