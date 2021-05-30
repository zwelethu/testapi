var supertest = require('supertest');
var should = require('should');

// This agent refers to PORT where program is runninng.

var server = supertest.agent('http://localhost:4500');

// UNIT test begin

describe('API unit test', function () {
  // #1 should return home page

  it('should return home page', function (done) {
    // calling home page api
    server
      .get('/api/v1')
      .expect('Content-type', /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        res.status.should.equal(200);
        done();
      });
  });

  it('should return error', function (done) {
    //calling GET api
    server
      .get('/api/v1/prices/bt')
      .expect('Content-type', /json/)
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(400);
        res.body.error.should.equal('Unsupported input received');
        done();
      });
  });

  it('should get data', function (done) {
    //calling GET api
    server
      .get('/api/v1/prices/bth')
      .expect('Content-type', /json/)
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        //res.body.data.should.equal({ zar: 19000, eur: 1190 });
        done();
      });
  });
});
