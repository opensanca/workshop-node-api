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
    it('Deve criar um usuário', (done) => {
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
    it('Deve retornar os detalhes do usuário', (done) => {
      request(app)
        .get(`/api/users/${user._id}`)
        .then((res) => {
          expect(res.body.data.username).to.equal(user.username);
          expect(res.statusCode).to.equal(httpStatus.OK);
          done();
        })
        .catch(done);
    });

    it('Deve reportar erro com a mensagem - Não encontrado, quando o usuário não existe', (done) => {
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
    it('Deve atualizar os detalhes do usuário', (done) => {
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
    it('Deve obter todos os usuários', (done) => {
      request(app)
        .get('/api/users')
        .then((res) => {
          expect(res.body.data).to.be.an('array');
          expect(res.statusCode).to.equal(httpStatus.OK);
          done();
        })
        .catch(done);
    });

    it('Deve obter todos os usuários (com limit e skip)', (done) => {
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
    it('Deve excluir o usuário', (done) => {
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