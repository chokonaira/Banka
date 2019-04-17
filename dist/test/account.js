"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _server = _interopRequireDefault(require("../server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai.default.use(_chaiHttp.default);

_chai.default.should();

var defaultUser = {
  email: 'user@gmail.com',
  password: 'user'
};
describe('Accounts', function () {
  var BearerToken;
  before(function () {
    _chai.default.request(_server.default).post('/api/v1/auth/login').send(defaultUser).end(function (err, res) {
      var token = res.body.data.token;

      if (token) {
        BearerToken = "Bearer ".concat(token);
      }
    });
  });
  it('Should return authentication error with status 401', function (done) {
    _chai.default.request(_server.default).post('/api/v1/accounts').send({
      type: 'currents',
      status: 'active',
      openingBalance: 50000
    }).end(function (err, res) {
      res.should.have.status(401);
      res.body.should.have.property('message');
      done();
    });
  });
  it('Should return validation error with status 400', function (done) {
    _chai.default.request(_server.default).post('/api/v1/accounts').send({}).set('authorization', BearerToken).end(function (err, res) {
      res.should.have.status(400);
      res.body.should.have.property('error');
      done();
    });
  });
  it('Should return success message with status 201', function (done) {
    _chai.default.request(_server.default).post('/api/v1/accounts').send({
      type: 'current',
      status: 'active',
      openingBalance: 50000
    }).set('authorization', BearerToken).end(function (err, res) {
      res.should.have.status(201);
      res.body.should.have.property('data');
      res.body.data.should.have.property('accountNumber');
      res.body.data.should.have.property('firstname');
      res.body.data.should.have.property('lastname');
      res.body.data.should.have.property('type').eql('current');
      res.body.data.should.have.property('openingBalance').eql(50000);
      done();
    });
  });
  it('Should return account already exist error with status 409', function (done) {
    _chai.default.request(_server.default).post('/api/v1/accounts').send({
      type: 'currents',
      status: 'active',
      openingBalance: 50000
    }).set('authorization', BearerToken).end(function (err, res) {
      res.should.have.status(409);
      res.body.should.have.property('message');
      done();
    });
  });
});