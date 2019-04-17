"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _server = _interopRequireDefault(require("../server"));

var _constants = _interopRequireDefault(require("./constants"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var johnAccountNumber = _constants.default.johnAccountNumber,
    doeAccountNumber = _constants.default.doeAccountNumber,
    nonExistingAccountNumber = _constants.default.nonExistingAccountNumber,
    defaultAdmin = _constants.default.defaultAdmin,
    defaultCashier = _constants.default.defaultCashier;

_chai.default.use(_chaiHttp.default);

_chai.default.should();

describe('Admin routes', function () {
  var BearerToken;
  before(function () {
    _chai.default.request(_server.default).post('/api/v1/auth/login').send(defaultAdmin).end(function (err, res) {
      var token = res.body.data.token;

      if (token) {
        BearerToken = "Bearer ".concat(token);
      }
    });
  });
  describe('Activate and deactivate', function () {
    it('Should return authentication error with 401', function (done) {
      _chai.default.request(_server.default).patch("/api/v1/accounts/".concat(johnAccountNumber)).send({
        status: 'dormant'
      }).end(function (err, res) {
        res.should.have.status(401);
        res.body.should.have.property('message');
        done();
      });
    });
    it('Should return invalid status field', function (done) {
      _chai.default.request(_server.default).patch("/api/v1/accounts/".concat(johnAccountNumber)).send({
        status: ''
      }).set('authorization', BearerToken).end(function (err, res) {
        res.should.have.status(401);
        res.body.should.have.property('message');
        done();
      });
    });
    it('Should return success with status 200', function (done) {
      _chai.default.request(_server.default).patch("/api/v1/accounts/".concat(johnAccountNumber)).send({
        status: 'dormant'
      }).set('authorization', BearerToken).end(function (err, res) {
        res.should.have.status(200);
        res.body.should.have.property('data');
        res.body.data.should.have.property('accountNumber');
        res.body.data.should.have.property('status').eql('dormant');
        done();
      });
    });
    it('Should return account number error with 404', function (done) {
      _chai.default.request(_server.default).patch("/api/v1/accounts/".concat(nonExistingAccountNumber)).send({
        status: 'dormant'
      }).set('authorization', BearerToken).end(function (err, res) {
        res.should.have.status(404);
        res.body.should.have.property('message');
        done();
      });
    });
  });
  describe('Delete account', function () {
    it('Should return authorization failed with status 401', function (done) {
      _chai.default.request(_server.default).delete("/api/v1/accounts/".concat(johnAccountNumber)).end(function (err, res) {
        res.should.have.status(401);
        res.body.should.have.property('message');
        done();
      });
    });
    it('Should return account not found error with status 404', function (done) {
      _chai.default.request(_server.default).delete("/api/v1/accounts/".concat(nonExistingAccountNumber)).set('authorization', BearerToken).end(function (err, res) {
        res.should.have.status(404);
        res.body.should.have.property('message');
        done();
      });
    });
    it('Should return success with status code 200', function (done) {
      _chai.default.request(_server.default).delete("/api/v1/accounts/".concat(johnAccountNumber)).set('authorization', BearerToken).end(function (err, res) {
        res.should.have.status(200);
        res.body.should.have.property('message');
        done();
      });
    });
  });
});
describe('Cashier routes', function () {
  var BearerToken;
  before(function () {
    _chai.default.request(_server.default).post('/api/v1/auth/login').send(defaultCashier).end(function (err, res) {
      var token = res.body.data.token;

      if (token) {
        BearerToken = "Bearer ".concat(token);
      }
    });
  });
  describe('Debit account', function () {
    it('Should return an authentication error with 401', function (done) {
      _chai.default.request(_server.default).post("/api/v1/transactions/".concat(doeAccountNumber, "/debit")).send({
        type: 'debit',
        amount: 500
      }).end(function (err, res) {
        res.should.have.status(401);
        res.body.should.have.property('message');
        done();
      });
    });
    it('Should return a validation failed error with status 400', function (done) {
      _chai.default.request(_server.default).post("/api/v1/transactions/".concat(doeAccountNumber, "/debit")).send({}).set('authorization', BearerToken).end(function (err, res) {
        res.should.have.status(400);
        res.body.should.have.property('message');
        done();
      });
    });
    it('Should return account not found error with status 404', function (done) {
      _chai.default.request(_server.default).post("/api/v1/transactions/".concat(nonExistingAccountNumber, "/debit")).send({
        type: 'debit',
        amount: 500
      }).set('authorization', BearerToken).end(function (err, res) {
        res.should.have.status(404);
        res.body.should.have.property('message');
        done();
      });
    });
    it('Should return insufficient funds with status 409', function (done) {
      _chai.default.request(_server.default).post("/api/v1/transactions/".concat(doeAccountNumber, "/debit")).send({
        type: 'debit',
        amount: 10000000000
      }).set('authorization', BearerToken).end(function (err, res) {
        res.should.have.status(409);
        res.body.should.have.property('message');
        done();
      });
    });
    it('Should return success message with status 201', function (done) {
      _chai.default.request(_server.default).post("/api/v1/transactions/".concat(doeAccountNumber, "/debit")).send({
        type: 'debit',
        amount: 500
      }).set('authorization', BearerToken).end(function (err, res) {
        res.should.have.status(201);
        res.body.should.have.property('data');
        res.body.data.should.have.property('accountNumber').eql(doeAccountNumber);
        res.body.data.should.have.property('amount').eql(500);
        res.body.data.should.have.property('type').eql('debit');
        res.body.data.should.have.property('newBalance');
        done();
      });
    });
  });
  describe('Credit account', function () {
    it('Should return an authentication error with 401', function (done) {
      _chai.default.request(_server.default).post("/api/v1/transactions/".concat(doeAccountNumber, "/credit")).send({
        type: 'credit',
        amount: 500
      }).end(function (err, res) {
        res.should.have.status(401);
        res.body.should.have.property('message');
        done();
      });
    });
    it('Should return a validation failed error with status 400', function (done) {
      _chai.default.request(_server.default).post("/api/v1/transactions/".concat(doeAccountNumber, "/credit")).send({}).set('authorization', BearerToken).end(function (err, res) {
        res.should.have.status(400);
        res.body.should.have.property('message');
        done();
      });
    });
    it('Should return account not found error with status 404', function (done) {
      _chai.default.request(_server.default).post("/api/v1/transactions/".concat(nonExistingAccountNumber, "/credit")).send({
        type: 'credit',
        amount: 500
      }).set('authorization', BearerToken).end(function (err, res) {
        res.should.have.status(404);
        res.body.should.have.property('message');
        done();
      });
    });
    it('Should return success message with status 201', function (done) {
      _chai.default.request(_server.default).post("/api/v1/transactions/".concat(doeAccountNumber, "/credit")).send({
        type: 'credit',
        amount: 500
      }).set('authorization', BearerToken).end(function (err, res) {
        res.should.have.status(201);
        res.body.should.have.property('data');
        res.body.data.should.have.property('accountNumber').eql(doeAccountNumber);
        res.body.data.should.have.property('amount').eql(500);
        res.body.data.should.have.property('type').eql('credit');
        res.body.data.should.have.property('newBalance');
        done();
      });
    });
  });
});