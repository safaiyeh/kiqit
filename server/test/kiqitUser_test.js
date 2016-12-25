const should = require('chai').should();
const expect = require('chai').expect;
const supertest = require('supertest');
const api = supertest('http://localhost:8080');

var id = null;

describe('KiqitUser', function() {
  it('POST /user should return 201', function(done) {
    const user = {
      email: 'jsafaiyeh@gmail.com',
      password: 'password',
    };

    api
      .post('/api/user')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        should.not.exist(res.body.password);
        done();
      });
  });

  it('POST /user/ used email should return 409', function(done) {
    const user = {
      email: 'jsafaiyeh@gmail.com',
      password: 'password',
    };

    api
      .post('/api/user')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(409);
        done();
      });
  });

  it('POST /user/ invalid email should return 409', function(done) {
    const user = {
      email: 'test@testhvhg.com',
      password: 'password',
    };

    api
      .post('/api/user')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(409);
        done();
      });
  });

  // TODO(jason): Login test gets id, not POST.
  it('POST /user/login should return 200', function(done) {
    const user = {
      email: 'jsafaiyeh@gmail.com',
      password: 'password',
    };

    api
      .post('/api/user/login')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        id = res.body._id;
        done();
      });
  });

  it('POST /user/login wrong password should return 400', function(done) {
    const user = {
      email: 'jsafaiyeh@gmail.com',
      password: 'passwor',
    };

    api
      .post('/api/user/login')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.login_status).to.equal('Login unsuccessful');
        done();
      });
  });

  it('POST /user/login user does not exist should return 404', function(done) {
    const user = {
      email: 'emai@test.com',
      password: 'password',
    };

    api
      .post('/api/user/login')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.login_status).to.equal('Login unsuccessful');
        done();
      });
  });

  it('DELETE /user/:id should return 200', function(done) {
    api
      .delete('/api/user/' + id)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('DELETE /user/:id unused id should return 404', function(done) {
    api
      .delete('/api/user/5765f73550dcdcc4baac0b84')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });
});
