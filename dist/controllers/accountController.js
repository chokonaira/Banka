"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _db = _interopRequireDefault(require("../db"));

var _auth = _interopRequireDefault(require("../middleware/auth"));

/* eslint-disable require-jsdoc */
var Account =
/*#__PURE__*/
function () {
  function Account() {
    (0, _classCallCheck2["default"])(this, Account);
  }

  (0, _createClass2["default"])(Account, null, [{
    key: "createAccount",
    value: function () {
      var _createAccount = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(req, res) {
        var user, owner, accountNo, createdOn, _req$body, type, status, openingBalance, createQuery, values, _ref, rows;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                user = _auth["default"].tokenBearer(req); // check the status of user ADMIN or USER

                if (!(!user.isAdmin && user.type.toLowerCase() === 'user')) {
                  _context.next = 19;
                  break;
                }

                owner = user.userId;
                accountNo = Math.floor(Math.random() * 1000000000);
                createdOn = new Date();
                _req$body = req.body, type = _req$body.type, status = _req$body.status, openingBalance = _req$body.openingBalance;
                createQuery = "INSERT INTO accounts(accountNo, createdOn, owner, type, status, openingBalance)\n                            VALUES ($1, $2, $3, $4, $5, $6) \n                            RETURNING accountNo, createdOn, owner, type, openingBalance, status";
                values = [accountNo, createdOn, owner, type.trim(), status.trim(), openingBalance];
                _context.prev = 8;
                _context.next = 11;
                return _db["default"].query(createQuery, values);

              case 11:
                _ref = _context.sent;
                rows = _ref.rows;
                return _context.abrupt("return", res.status(201).send({
                  status: 201,
                  message: 'Account created successfully',
                  data: rows[0]
                }));

              case 16:
                _context.prev = 16;
                _context.t0 = _context["catch"](8);
                return _context.abrupt("return", res.status(500).send({
                  status: 500,
                  error: 'Unable to Create Account!! Server Error, Try Again'
                }));

              case 19:
                return _context.abrupt("return", res.status(401).json({
                  status: 401,
                  error: 'you must be a user to perform this task'
                }));

              case 20:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[8, 16]]);
      }));

      function createAccount(_x, _x2) {
        return _createAccount.apply(this, arguments);
      }

      return createAccount;
    }()
  }, {
    key: "getAllTransactions",
    value: function () {
      var _getAllTransactions = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(req, res) {
        var user, query, _ref2, rows;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                user = _auth["default"].tokenBearer(req);

                if (!(!user.isAdmin && user.type.toLowerCase() === 'user')) {
                  _context2.next = 18;
                  break;
                }

                query = 'SELECT * FROM transactions WHERE accountNo = $1';
                _context2.prev = 3;
                _context2.next = 6;
                return _db["default"].query(query, [req.params.accountNumber]);

              case 6:
                _ref2 = _context2.sent;
                rows = _ref2.rows;

                if (!(!rows || rows.length === 0)) {
                  _context2.next = 10;
                  break;
                }

                return _context2.abrupt("return", res.status(404).send({
                  status: 404,
                  error: 'No existing transactions for this account'
                }));

              case 10:
                return _context2.abrupt("return", res.status(200).send({
                  status: 200,
                  data: rows
                }));

              case 13:
                _context2.prev = 13;
                _context2.t0 = _context2["catch"](3);
                return _context2.abrupt("return", res.status(500).send({
                  status: 500,
                  error: _context2.t0.message
                }));

              case 16:
                _context2.next = 19;
                break;

              case 18:
                return _context2.abrupt("return", res.status(401).json({
                  status: 401,
                  error: 'you must be a user to perform this task'
                }));

              case 19:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[3, 13]]);
      }));

      function getAllTransactions(_x3, _x4) {
        return _getAllTransactions.apply(this, arguments);
      }

      return getAllTransactions;
    }()
  }, {
    key: "getTransaction",
    value: function () {
      var _getTransaction = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(req, res) {
        var user, query, _ref3, rows;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                user = _auth["default"].tokenBearer(req);

                if (!(!user.isAdmin && user.type.toLowerCase() === 'user')) {
                  _context3.next = 18;
                  break;
                }

                query = 'SELECT * FROM transactions WHERE transaction_id = $1';
                _context3.prev = 3;
                _context3.next = 6;
                return _db["default"].query(query, [req.params.transactionId]);

              case 6:
                _ref3 = _context3.sent;
                rows = _ref3.rows;

                if (rows[0]) {
                  _context3.next = 10;
                  break;
                }

                return _context3.abrupt("return", res.status(404).send({
                  status: 404,
                  error: 'The selected transaction does not exist'
                }));

              case 10:
                return _context3.abrupt("return", res.status(200).send({
                  status: 200,
                  data: rows[0]
                }));

              case 13:
                _context3.prev = 13;
                _context3.t0 = _context3["catch"](3);
                return _context3.abrupt("return", res.status(500).send({
                  status: 500,
                  error: _context3.t0.message
                }));

              case 16:
                _context3.next = 19;
                break;

              case 18:
                return _context3.abrupt("return", res.status(401).json({
                  status: 401,
                  error: 'you must be a user to perform this task'
                }));

              case 19:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[3, 13]]);
      }));

      function getTransaction(_x5, _x6) {
        return _getTransaction.apply(this, arguments);
      }

      return getTransaction;
    }()
  }, {
    key: "accountDetails",
    value: function () {
      var _accountDetails = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4(req, res) {
        var user, query, _ref4, rows;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                user = _auth["default"].tokenBearer(req);

                if (!(!user.isAdmin && user.type.toLowerCase() === 'user')) {
                  _context4.next = 16;
                  break;
                }

                query = 'SELECT * FROM accounts WHERE accountNo = $1';
                _context4.prev = 3;
                _context4.next = 6;
                return _db["default"].query(query, [req.params.accountNumber]);

              case 6:
                _ref4 = _context4.sent;
                rows = _ref4.rows;

                if (rows[0]) {
                  _context4.next = 10;
                  break;
                }

                return _context4.abrupt("return", res.status(404).send({
                  status: 404,
                  data: 'Account does not exist'
                }));

              case 10:
                return _context4.abrupt("return", res.status(200).send({
                  status: 200,
                  data: rows[0]
                }));

              case 13:
                _context4.prev = 13;
                _context4.t0 = _context4["catch"](3);
                return _context4.abrupt("return", res.status(500).send({
                  status: 500,
                  error: 'Server Error, Please Try Again',
                  message: _context4.t0.message
                }));

              case 16:
                return _context4.abrupt("return", res.status(401).json({
                  status: 401,
                  message: 'you must be a user to perform this task'
                }));

              case 17:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[3, 13]]);
      }));

      function accountDetails(_x7, _x8) {
        return _accountDetails.apply(this, arguments);
      }

      return accountDetails;
    }()
  }]);
  return Account;
}();

var _default = Account;
exports["default"] = _default;