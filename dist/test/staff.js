"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _server = _interopRequireDefault(require("../server"));

var _constants = _interopRequireDefault(require("./constants"));

_chai["default"].use(_chaiHttp["default"]);

_chai["default"].should();

var userBearerToken;
var cashierBearerToken;
var adminBearerToken;
describe('Staff routes', function () {
  this.timeout(0);
  before(
  /*#__PURE__*/
  (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var adminRes, adminToken, cashierRes, cashierToken;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _chai["default"].request(_server["default"]).post('/api/v1/auth/login').send({
              email: _constants["default"].testAdmin.email,
              password: _constants["default"].testAdmin.password
            });

          case 2:
            adminRes = _context.sent;
            adminToken = adminRes.body.data.token;
            adminBearerToken = "Bearer ".concat(adminToken); //login cashier

            _context.next = 7;
            return _chai["default"].request(_server["default"]).post('/api/v1/auth/login').send({
              email: _constants["default"].testCashier.email,
              password: _constants["default"].testCashier.password
            });

          case 7:
            cashierRes = _context.sent;
            cashierToken = cashierRes.body.data.token;
            cashierBearerToken = "Bearer ".concat(cashierToken);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  describe('Activate or deactivate an account', function () {
    it('Should return token not provided error with status 401',
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee2() {
      var res;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _chai["default"].request(_server["default"]).patch("/api/v1/accounts/".concat(_constants["default"].validAcccountNumber)).send({
                status: 'dormant'
              });

            case 2:
              res = _context2.sent;
              res.should.have.status(401);
              res.body.should.have.property('error');
              res.body.error.should.equal('Token not Provided');

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
    it('Should return jwt error for invalid signature with status 401',
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee3() {
      var res;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _chai["default"].request(_server["default"]).patch("/api/v1/accounts/".concat(_constants["default"].validAcccountNumber)).send({
                status: 'dormant'
              }).set('authorization', _constants["default"].invalidToken);

            case 2:
              res = _context3.sent;
              res.should.have.status(401);
              res.body.should.have.property('error');
              res.body.error.should.equal('invalid signature');

            case 6:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
    it('Should return input status is required error with status 422',
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee4() {
      var res;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return _chai["default"].request(_server["default"]).patch("/api/v1/accounts/".concat(_constants["default"].validAcccountNumber)).send({}).set('authorization', adminBearerToken);

            case 2:
              res = _context4.sent;
              res.should.have.status(422);
              res.body.should.have.property('error');
              res.body.error[0].should.equal('status is required');

            case 6:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));
    it('Should return invalid account number with status 400',
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee5() {
      var res;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return _chai["default"].request(_server["default"]).patch("/api/v1/accounts/".concat(_constants["default"].invalidAccountNumber)).send({
                status: 'dormant'
              }).set('authorization', adminBearerToken);

            case 2:
              res = _context5.sent;
              res.should.have.status(400);
              res.body.should.have.property('error');
              res.body.error.should.equal('Invalid account number, account number must be 9 digits long');

            case 6:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    })));
    it('Should return invalid account status field with status 400',
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee6() {
      var res;
      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return _chai["default"].request(_server["default"]).patch("/api/v1/accounts/".concat(_constants["default"].validAcccountNumber)).send({
                status: 'nottactive'
              }).set('authorization', adminBearerToken);

            case 2:
              res = _context6.sent;
              res.should.have.status(400);
              res.body.should.have.property('error');
              res.body.error.should.equal('Invalid account status field, status should be "dormant" or "active');

            case 6:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    })));
    it('Should return account does not exist with status 404',
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee7() {
      var res;
      return _regenerator["default"].wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return _chai["default"].request(_server["default"]).patch("/api/v1/accounts/123445678").send({
                status: 'dormant'
              }).set('authorization', adminBearerToken);

            case 2:
              res = _context7.sent;
              res.should.have.status(404);
              res.body.should.have.property('error');
              res.body.error.should.equal('Account does not exist');

            case 6:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    })));
    it('Should return account updated successfully with account data and status 201',
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee8() {
      var res;
      return _regenerator["default"].wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return _chai["default"].request(_server["default"]).patch("/api/v1/accounts/".concat(_constants["default"].validAcccountNumber)).send({
                status: 'dormant'
              }).set('authorization', adminBearerToken);

            case 2:
              res = _context8.sent;
              res.should.have.status(200);
              res.body.should.have.property('data');
              res.body.data.should.have.property('account_id');
              res.body.data.should.have.property('accountno');
              res.body.data.should.have.property('createdon');
              res.body.data.should.have.property('owner');
              res.body.data.should.have.property('status').eq('dormant');
              res.body.data.should.have.property('type').eql('saving');
              res.body.data.should.have.property('openingbalance').eql('5000');

            case 12:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    })));
    describe('get all bank accounts', function () {
      it('Should return all bank accounts with status 200',
      /*#__PURE__*/
      (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee9() {
        var res;
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return _chai["default"].request(_server["default"]).get('/api/v1/accounts').set('authorization', adminBearerToken);

              case 2:
                res = _context9.sent;
                res.should.have.status(200);
                res.body.should.have.property('data');

              case 5:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      })));
      it('Should return all dormant bank accounts with status 200',
      /*#__PURE__*/
      (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee10() {
        var res;
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return _chai["default"].request(_server["default"]).get('/api/v1/accounts?status=dormant').set('authorization', adminBearerToken);

              case 2:
                res = _context10.sent;
                res.should.have.status(200);
                res.body.should.have.property('data');

              case 5:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      })));
      it('Should return all active bank accounts with status 200',
      /*#__PURE__*/
      (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee11() {
        var res;
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return _chai["default"].request(_server["default"]).get('/api/v1/accounts?status=active').set('authorization', adminBearerToken);

              case 2:
                res = _context11.sent;
                res.should.have.status(200);
                res.body.should.have.property('data');

              case 5:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11);
      })));
    });
    describe('get a specific user accounts', function () {
      it('Should return no account found with status 404',
      /*#__PURE__*/
      (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee12() {
        var res;
        return _regenerator["default"].wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return _chai["default"].request(_server["default"]).get("/api/v1/user/".concat(_constants["default"].invalidEmail, "/accounts")).set('authorization', adminBearerToken);

              case 2:
                res = _context12.sent;
                res.should.have.status(404);
                res.body.should.have.property('message');
                res.body.message.should.equal('No account found for the selected user');

              case 6:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12);
      })));
      it('Should return all the user\'s bank accounts with status 200',
      /*#__PURE__*/
      (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee13() {
        var res;
        return _regenerator["default"].wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.next = 2;
                return _chai["default"].request(_server["default"]).get("/api/v1/user/".concat(_constants["default"].validEmail, "/accounts")).set('authorization', adminBearerToken);

              case 2:
                res = _context13.sent;
                res.should.have.status(200);
                res.body.should.have.property('data');

              case 5:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13);
      })));
    }); //     it('Should return an authorization error with status 401', async () => {
    //       const res = await chai
    //         .request(app)
    //         .post('/api/v1/accounts')
    //         .send(constants.newAccount)
    //         .set('authorization', cashierBearerToken)
    //       res.should.have.status(401);
    //       res.body.should.have.property('error');
    //       res.body.error.should.equal('you must be a user to perform this task');
    //     });
    //   })
    //   describe('Get all user transactions', () => {
    //     it('Should return invalid account number with status 409', async () => {
    //       const res = await chai
    //         .request(app)
    //         .get(`/api/v1/accounts/${constants.invalidAccountNumber}/transactions`)
    //       res.should.have.status(409);
    //       res.body.should.have.property('error');
    //       res.body.error.should.equal('Invalid account number, account number must be 9 digits long');
    //     });
    //     it('Should return token not provided error with status 401', async () => {
    //       const res = await chai
    //         .request(app)
    //         .get(`/api/v1/accounts/${constants.validAcccountNumber}/transactions`)
    //       res.should.have.status(401);
    //       res.body.should.have.property('error');
    //       res.body.error.should.equal('Token not Provided');
    //     });
    //     it('Should return jwt error for invalid signature with status 401', async () => {
    //       const res = await chai
    //         .request(app)
    //         .get(`/api/v1/accounts/${constants.validAcccountNumber}/transactions`)
    //         .set('authorization', constants.invalidToken)
    //       res.should.have.status(401);
    //       res.body.should.have.property('error');
    //       res.body.error.should.equal('invalid signature')
    //     });
    //     it('Should return no tranactions for this account error with status 404', async () => {
    //       const res = await chai
    //         .request(app)
    //         .get(`/api/v1/accounts/123445678/transactions`)
    //         .set('authorization', userBearerToken)
    //       res.should.have.status(404);
    //       res.body.should.have.property('error');
    //       res.body.error.should.equal('No existing transactions for this account');
    //     });
    //     it('Should return all trasactions and status 200', async () => {
    //       const res = await chai
    //         .request(app)
    //         .get(`/api/v1/accounts/${constants.validAcccountNumber}/transactions`)
    //         .set('authorization', userBearerToken)
    //       res.should.have.status(200);
    //       res.body.should.have.property('data');
    //       res.body.data.should.have.length(3);
    //     });
    //     it('Should return an authorization error with status 401', async () => {
    //       const res = await chai
    //         .request(app)
    //         .get(`/api/v1/accounts/${constants.validAcccountNumber}/transactions`)
    //         .set('authorization', cashierBearerToken)
    //       res.should.have.status(401);
    //       res.body.should.have.property('error');
    //       res.body.error.should.equal('you must be a user to perform this task');
    //     });
    //   })
    //   describe('Get a single transaction', () => {
    //     it('Should return transaction does not exist error with status 404', async () => {
    //       const res = await chai
    //         .request(app)
    //         .get(`/api/v1/transactions/10`)
    //         .set('authorization', userBearerToken)
    //       res.should.have.status(404);
    //       res.body.should.have.property('error');
    //       res.body.error.should.equal('The selected transaction does not exist');
    //     });
    //     it('Should return all trasactions and status 200', async () => {
    //       const res = await chai
    //         .request(app)
    //         .get(`/api/v1/transactions/1`)
    //         .set('authorization', userBearerToken)
    //       res.should.have.status(200);
    //       res.body.should.have.property('data');
    //     });
    //     });
  });
});