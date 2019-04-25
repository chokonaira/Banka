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
describe('Account', function () {
  this.timeout(0);
  before('Login user to get access token',
  /*#__PURE__*/
  (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var userRes, userToken, cashierRes, cashierToken;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _chai["default"].request(_server["default"]).post('/api/v1/auth/login').send({
              email: _constants["default"].testUser.email,
              password: _constants["default"].testUser.password
            });

          case 2:
            userRes = _context.sent;
            userToken = userRes.body.data.token;
            userBearerToken = "Bearer ".concat(userToken); //login cashier

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
  describe('Create a bank account', function () {
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
              return _chai["default"].request(_server["default"]).post('/api/v1/accounts').send(_constants["default"].newAccount);

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
              return _chai["default"].request(_server["default"]).post('/api/v1/accounts').send(_constants["default"].newAccount).set('authorization', _constants["default"].invalidToken);

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
    it('Should return input type is required error with status 422',
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
              return _chai["default"].request(_server["default"]).post('/api/v1/accounts').send({
                status: _constants["default"].newAccount.status,
                openingBalance: _constants["default"].newAccount.openingBalance
              }).set('authorization', userBearerToken);

            case 2:
              res = _context4.sent;
              res.should.have.status(422);
              res.body.should.have.property('error');
              res.body.error[0].should.equal('type is required');

            case 6:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));
    it('Should return account created successfully with account data and status 201',
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
              return _chai["default"].request(_server["default"]).post('/api/v1/accounts').send(_constants["default"].newAccount).set('authorization', userBearerToken);

            case 2:
              res = _context5.sent;
              res.should.have.status(201);
              res.body.should.have.property('message');
              res.body.message.should.equal('Account created successfully');
              res.body.should.have.property('data');
              res.body.data.should.have.property('accountno');
              res.body.data.should.have.property('createdon');
              res.body.data.should.have.property('owner');
              res.body.data.should.have.property('status').eq('active');
              res.body.data.should.have.property('type').eql('current');
              res.body.data.should.have.property('openingbalance').eql('50000');

            case 13:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    })));
    it('Should return an authorization error with status 401',
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
              return _chai["default"].request(_server["default"]).post('/api/v1/accounts').send(_constants["default"].newAccount).set('authorization', cashierBearerToken);

            case 2:
              res = _context6.sent;
              res.should.have.status(401);
              res.body.should.have.property('error');
              res.body.error.should.equal('you must be a user to perform this task');

            case 6:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    })));
  });
  describe('Get all user transactions', function () {
    it('Should return invalid account number with status 400',
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
              return _chai["default"].request(_server["default"]).get("/api/v1/accounts/".concat(_constants["default"].invalidAccountNumber, "/transactions"));

            case 2:
              res = _context7.sent;
              res.should.have.status(400);
              res.body.should.have.property('error');
              res.body.error.should.equal('Invalid account number, account number must be 9 digits long');

            case 6:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    })));
    it('Should return token not provided error with status 401',
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
              return _chai["default"].request(_server["default"]).get("/api/v1/accounts/".concat(_constants["default"].validAcccountNumber, "/transactions"));

            case 2:
              res = _context8.sent;
              res.should.have.status(401);
              res.body.should.have.property('error');
              res.body.error.should.equal('Token not Provided');

            case 6:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    })));
    it('Should return jwt error for invalid signature with status 401',
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
              return _chai["default"].request(_server["default"]).get("/api/v1/accounts/".concat(_constants["default"].validAcccountNumber, "/transactions")).set('authorization', _constants["default"].invalidToken);

            case 2:
              res = _context9.sent;
              res.should.have.status(401);
              res.body.should.have.property('error');
              res.body.error.should.equal('invalid signature');

            case 6:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    })));
    it('Should return no tranactions for this account error with status 404',
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
              return _chai["default"].request(_server["default"]).get("/api/v1/accounts/123445678/transactions").set('authorization', userBearerToken);

            case 2:
              res = _context10.sent;
              res.should.have.status(404);
              res.body.should.have.property('error');
              res.body.error.should.equal('No existing transactions for this account');

            case 6:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    })));
    it('Should return all trasactions and status 200',
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
              return _chai["default"].request(_server["default"]).get("/api/v1/accounts/".concat(_constants["default"].validAcccountNumber, "/transactions")).set('authorization', userBearerToken);

            case 2:
              res = _context11.sent;
              res.should.have.status(200);
              res.body.should.have.property('data');
              res.body.data.should.have.length(3);

            case 6:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    })));
    it('Should return an authorization error with status 401',
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
              return _chai["default"].request(_server["default"]).get("/api/v1/accounts/".concat(_constants["default"].validAcccountNumber, "/transactions")).set('authorization', cashierBearerToken);

            case 2:
              res = _context12.sent;
              res.should.have.status(401);
              res.body.should.have.property('error');
              res.body.error.should.equal('you must be a user to perform this task');

            case 6:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    })));
  });
  describe('Get a single transaction', function () {
    it('Should return transaction does not exist error with status 404',
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
              return _chai["default"].request(_server["default"]).get("/api/v1/transactions/10").set('authorization', userBearerToken);

            case 2:
              res = _context13.sent;
              res.should.have.status(404);
              res.body.should.have.property('error');
              res.body.error.should.equal('The selected transaction does not exist');

            case 6:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13);
    })));
    it('Should return all trasactions and status 200',
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee14() {
      var res;
      return _regenerator["default"].wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _context14.next = 2;
              return _chai["default"].request(_server["default"]).get("/api/v1/transactions/1").set('authorization', userBearerToken);

            case 2:
              res = _context14.sent;
              res.should.have.status(200);
              res.body.should.have.property('data');

            case 5:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    })));
  });
});