const should = require('chai').should();
const expect = require('chai').expect;
const supertest = require('supertest');
const api = supertest('http://localhost:8080');

var id = null;
const start_time = new Date('2016-06-12T16:06:15.384Z');
const end_time = new Date('2016-06-12T16:05:24.296Z');

describe('Event', function() {
  it('POST /event should return 201 and data', function(done) {
    const event = {
      title: 'a',
      description: 'b',
      location: 'test',
      start_time: start_time,
      end_time: end_time,
      adminid: '577f16ad781bda97064eb357',
    };

    api
      .post('/api/event')
      .send(event)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.title).to.equal('a');
        expect(res.body.description).to.equal('b');
        expect(res.body.location).to.equal('test');
        expect(res.body.start_time).to.equal(start_time.toISOString());
        expect(res.body.end_time).to.equal(end_time.toISOString());
        id = res.body._id;
        done();
      });
  });

  it('POST /event invalid admin id returns 403', function(done) {
    const event = {
      title: 'a',
      description: 'b',
      location: 'test',
      start_time: start_time,
      end_time: end_time,
      adminid: '577f16ad781bda97064eb358',
    };

    api
      .post('/api/event')
      .send(event)
      .end((err, res) => {
        expect(res.status).to.equal(403);
        done();
      });
  });

  it('POST /event with missing fields should return 409', function(done) {
    const event = {
      adminid: '577f16ad781bda97064eb357',
    };

      api
        .post('/api/event')
        .send(event)
        .end((err, res) => {
          expect(res.status).to.equal(409);
          done();
      });
  });

  it('GET /event/:id should return 200 and data', function(done) {
    api
      .get('/api/event/' + id)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.updatedAt).is.not.equal(null);
        expect(res.body.createdAt).is.not.equal(null);
        expect(res.body.start_time).to.equal(start_time.toISOString());
        expect(res.body.end_time).to.equal(end_time.toISOString());
        expect(res.body._id).is.equal(id);
        done();
      });
  });

  it('GET /event/:id nonexisiting event returns 404', function(done) {
    api
      .get('/api/event/5760dcdd49dd234e3e6525bf')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });

  it('PATCH /event/:id should return 200 and update data', function(done) {
    const event = {
      title: 'b',
      description: 'a',
      location: 'Test2',
      start_time: end_time,
      end_time: start_time,
    };

    api
      .patch('/api/event/' + id)
      .send(event)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.title).is.equal('b');
        expect(res.body.description).is.equal('a');
        expect(res.body.location).is.equal('Test2')
        expect(res.body.start_time).is.equal(end_time.toISOString());
        expect(res.body.end_time).is.equal(start_time.toISOString());
        expect(res.body._id).is.equal(id);
        done();
      });
  });

  it('PATCH /event/:id nonexisiting event should return 404', function(done) {
    const event = {
      title: 'b',
    };

    api
      .patch('/api/event/5760dcdd49dd234e3e6525bf')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });

  it('DELETE /event/:id should return 200', function(done) {
    api
      .delete('/api/event/' + id)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('DELETE /event/:id nonexisting event should return 404', function(done) {
      api
        .delete('/api/event/5760dcdd49dd234e3e6525bf')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
  });

});
