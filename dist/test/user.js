"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _server = _interopRequireDefault(require("../server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai.default.use(_chaiHttp.default);

_chai.default.should();

var firstname = 'Lorem';
var lastname = 'Ipsum';
var email = 'lorem@gmail.com';
var existingUserEmail = 'admin@gmail.com';
var nonExistingUserEmail = 'john@gamil.com';
var type = 'User';
var password = 'password';
var existingPassword = 'admin';
var isAdmin = false;
describe('Users routes', function () {
  describe('Signup', function () {
    it('Should return a validation failed error 400', function (done) {
      _chai.default.request(_server.default).post('/api/v1/auth/signup').send({
        firstname: firstname,
        lastname: lastname,
        type: type,
        password: password,
        isAdmin: isAdmin
      }).end(function (err, res) {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
    });
    it('Should return user data with status 201 for success', function (done) {
      _chai.default.request(_server.default).post('/api/v1/auth/signup').send({
        firstname: firstname,
        lastname: lastname,
        email: email,
        type: type,
        password: password,
        isAdmin: isAdmin
      }).end(function (err, res) {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.have.property('id');
        res.body.data.should.have.property('token');
        res.body.data.should.have.property('firstname');
        res.body.data.should.have.property('lastname');
        res.body.data.should.have.property('email');
        res.body.data.should.have.property('type');
        done();
      });
    });
    it('Should return a user exist error with status 409', function (done) {
      _chai.default.request(_server.default).post('/api/v1/auth/signup').send({
        firstname: firstname,
        lastname: lastname,
        email: existingUserEmail,
        type: type,
        password: existingPassword,
        isAdmin: isAdmin
      }).end(function (err, res) {
        res.should.have.status(409);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        done();
      });
    });
  });
  describe('Login', function () {
    it('Should return a validation failed error with status 400', function (done) {
      _chai.default.request(_server.default).post('/api/v1/auth/login').send({
        email: email
      }).end(function (err, res) {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
    });
    it('Should return login success with status 200', function (done) {
      _chai.default.request(_server.default).post('/api/v1/auth/login').send({
        email: existingUserEmail,
        password: existingPassword
      }).end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.should.have.property('data');
        res.body.data.should.have.property('token');
        res.body.data.should.have.property('id');
        res.body.data.should.have.property('firstname');
        res.body.data.should.have.property('lastname');
        res.body.data.should.have.property('email');
        done();
      });
    });
    it('Should return user not found with status 404', function (done) {
      _chai.default.request(_server.default).post('/api/v1/auth/login').send({
        email: nonExistingUserEmail,
        password: password
      }).end(function (err, res) {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        done();
      });
    });
  });
});