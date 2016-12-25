const should = require('chai').should();
const expect = require('chai').expect;
const supertest = require('supertest');
const api = supertest('http://localhost:8080');

var id = null;

describe('KiqitAdminUser', function() {
  it('POST /adminuser should return 201', function(done) {
    const adminUser = {
      email: 'jason.safaiyeh@sjsu.edu',
      password: 'password',
    };

    api
      .post('/api/adminuser')
      .send(adminUser)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        should.not.exist(res.body.password);
        done();
      });
  });

  it('POST /adminuser/ used email should return 409', function(done) {
    const adminUser = {
      email: 'jason.safaiyeh@sjsu.edu',
      password: 'password',
    };

    api
      .post('/api/adminuser')
      .send(adminUser)
      .end((err, res) => {
        expect(res.status).to.equal(409);
        done();
      });
  });

  it('POST /adminuser/ invalid email should return 409', function(done) {
    const adminUser = {
      email: 'test@testhvhg.com',
      password: 'password',
    };

    api
      .post('/api/adminuser')
      .send(adminUser)
      .end((err, res) => {
        expect(res.status).to.equal(409);
        done();
      });
  });

  // TODO(jason): Login test gets id, not POST.
  it('POST /adminuser/login should return 200', function(done) {
    const adminUser = {
      email: 'jason.safaiyeh@sjsu.edu',
      password: 'password',
    };

    api
      .post('/api/adminuser/login')
      .send(adminUser)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        id = res.body._id;
        done();
      });
  });

  it('POST /adminuser/login wrong password should return 400', function(done) {
    const adminUser = {
      email: 'jason.safaiyeh@sjsu.edu',
      password: 'passwor',
    };

    api
      .post('/api/adminuser/login')
      .send(adminUser)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.login_status).to.equal('Login unsuccessful');
        done();
      });
  });

  it('POST /adminuser/login user does not exist should return 404', function(done) {
    const adminUser = {
      email: 'emai@test.com',
      password: 'password',
    };

    api
      .post('/api/adminuser/login')
      .send(adminUser)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.login_status).to.equal('Login unsuccessful');
        done();
      });
  });

  it('DELETE /adminuser/:id should return 200', function(done) {
    api
      .delete('/api/adminuser/' + id)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('DELETE /adminuser/:id unused id should return 404', function(done) {
    api
      .delete('/api/adminuser/5765f73550dcdcc4baac0b84')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });
});
