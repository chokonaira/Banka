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

/* eslint-disable no-unused-expressions */

/* eslint-disable require-jsdoc */
var StaffController =
/*#__PURE__*/
function () {
  function StaffController() {
    (0, _classCallCheck2["default"])(this, StaffController);
  }

  (0, _createClass2["default"])(StaffController, null, [{
    key: "ActivatOrDeactivateAccct",
    value: function () {
      var _ActivatOrDeactivateAccct = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(req, res) {
        var user, accountNumber, getAccountQuery, editQuery, status, statusOptions, values, _ref, rows, response;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                user = _auth["default"].tokenBearer(req);
                accountNumber = req.params.accountNumber;

                if (!(user.isAdmin && user.type === 'staff')) {
                  _context.next = 26;
                  break;
                }

                getAccountQuery = 'SELECT * FROM  accounts WHERE accountNo = $1';
                editQuery = "UPDATE accounts SET status=$1 WHERE accountNo=$2 \n    RETURNING *";
                status = req.body.status;
                statusOptions = ['dormant', 'active'];
                values = [status.trim(), accountNumber];
                _context.prev = 8;
                _context.next = 11;
                return _db["default"].query(getAccountQuery, [accountNumber]);

              case 11:
                _ref = _context.sent;
                rows = _ref.rows;

                if (rows[0]) {
                  _context.next = 15;
                  break;
                }

                return _context.abrupt("return", res.status(404).send({
                  status: 404,
                  error: 'Account does not exist'
                }));

              case 15:
                if (statusOptions.includes(status)) {
                  _context.next = 17;
                  break;
                }

                return _context.abrupt("return", res.status(400).json({
                  status: 400,
                  error: 'Invalid account status field, status should be "dormant" or "active'
                }));

              case 17:
                _context.next = 19;
                return _db["default"].query(editQuery, values);

              case 19:
                response = _context.sent;
                return _context.abrupt("return", res.status(200).send({
                  status: 200,
                  data: response.rows[0]
                }));

              case 23:
                _context.prev = 23;
                _context.t0 = _context["catch"](8);
                return _context.abrupt("return", res.status(500).json({
                  status: status,
                  message: _context.t0.message
                }));

              case 26:
                return _context.abrupt("return", res.status(401).json({
                  status: 401,
                  message: 'you must be a staff (Admin) to perform this task'
                }));

              case 27:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[8, 23]]);
      }));

      function ActivatOrDeactivateAccct(_x, _x2) {
        return _ActivatOrDeactivateAccct.apply(this, arguments);
      }

      return ActivatOrDeactivateAccct;
    }()
  }, {
    key: "getAllAccounts",
    value: function () {
      var _getAllAccounts = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(req, res) {
        var user, allAccountsQuery, values, _ref2, rows;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                user = _auth["default"].tokenBearer(req);

                if (!(user.isAdmin && user.type.toLowerCase() === 'staff')) {
                  _context2.next = 17;
                  break;
                }

                values = [];

                if (req.query.status) {
                  allAccountsQuery = 'SELECT * FROM accounts WHERE status = $1 ORDER BY createdOn DESC';
                  values = [req.query.status];
                } else {
                  allAccountsQuery = 'SELECT * FROM accounts ORDER BY createdOn DESC';
                }

                _context2.prev = 4;
                _context2.next = 7;
                return _db["default"].query(allAccountsQuery, values);

              case 7:
                _ref2 = _context2.sent;
                rows = _ref2.rows;

                if (!(!rows || rows.length === 0)) {
                  _context2.next = 11;
                  break;
                }

                return _context2.abrupt("return", res.status(404).send({
                  status: 404,
                  message: 'No account found'
                }));

              case 11:
                return _context2.abrupt("return", res.status(200).send({
                  status: 200,
                  data: rows
                }));

              case 14:
                _context2.prev = 14;
                _context2.t0 = _context2["catch"](4);
                return _context2.abrupt("return", res.status(500).send({
                  status: 500,
                  error: 'Unable to get all account details!! Server Error, Please Try Again'
                }));

              case 17:
                return _context2.abrupt("return", res.status(401).send({
                  status: 401,
                  message: 'you must be a staff (Admin) to perform this task'
                }));

              case 18:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[4, 14]]);
      }));

      function getAllAccounts(_x3, _x4) {
        return _getAllAccounts.apply(this, arguments);
      }

      return getAllAccounts;
    }()
  }, {
    key: "getUserAccounts",
    value: function () {
      var _getUserAccounts = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(req, res) {
        var user, allAccountsQuery, _ref3, rows;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                user = _auth["default"].tokenBearer(req);

                if (!(user.isAdmin && user.type.toLowerCase() === 'staff')) {
                  _context3.next = 16;
                  break;
                }

                allAccountsQuery = 'SELECT * FROM accounts WHERE owner = (SELECT user_id FROM users WHERE email = $1)';
                _context3.prev = 3;
                _context3.next = 6;
                return _db["default"].query(allAccountsQuery, [req.params.userEmail]);

              case 6:
                _ref3 = _context3.sent;
                rows = _ref3.rows;

                if (!(!rows || rows.length === 0)) {
                  _context3.next = 10;
                  break;
                }

                return _context3.abrupt("return", res.status(404).json({
                  status: 404,
                  message: 'No account found for the selected user'
                }));

              case 10:
                return _context3.abrupt("return", res.status(200).send({
                  status: 200,
                  data: rows
                }));

              case 13:
                _context3.prev = 13;
                _context3.t0 = _context3["catch"](3);
                return _context3.abrupt("return", res.status(500).send({
                  status: 500,
                  error: 'Unable to get all account details!! Server Error, Please Try Again'
                }));

              case 16:
                return _context3.abrupt("return", res.status(401).json({
                  status: 401,
                  message: 'you must be a staff (Admin) to perform this task'
                }));

              case 17:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[3, 13]]);
      }));

      function getUserAccounts(_x5, _x6) {
        return _getUserAccounts.apply(this, arguments);
      }

      return getUserAccounts;
    }()
  }, {
    key: "deleteAccount",
    value: function () {
      var _deleteAccount = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4(req, res) {
        var user, deleteQuery, _ref4, rowCount;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                user = _auth["default"].tokenBearer(req);

                if (!user.isAdmin) {
                  _context4.next = 16;
                  break;
                }

                deleteQuery = 'DELETE FROM accounts WHERE accountNo = $1';
                _context4.prev = 3;
                _context4.next = 6;
                return _db["default"].query(deleteQuery, [req.params.accountNumber]);

              case 6:
                _ref4 = _context4.sent;
                rowCount = _ref4.rowCount;

                if (!(rowCount === 0)) {
                  _context4.next = 10;
                  break;
                }

                return _context4.abrupt("return", res.status(404).send({
                  status: 404,
                  data: 'Account does not exist'
                }));

              case 10:
                return _context4.abrupt("return", res.status(204).send({
                  status: 204,
                  message: 'Seleted account successfully deleted'
                }));

              case 13:
                _context4.prev = 13;
                _context4.t0 = _context4["catch"](3);
                return _context4.abrupt("return", res.status(500).send({
                  status: 500,
                  error: 'Account delete not completed!! Server Error, Please Try Again',
                  message: _context4.t0.message
                }));

              case 16:
                return _context4.abrupt("return", res.status(401).json({
                  status: 401,
                  message: 'you must be a staff (Admin) to perform this task'
                }));

              case 17:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[3, 13]]);
      }));

      function deleteAccount(_x7, _x8) {
        return _deleteAccount.apply(this, arguments);
      }

      return deleteAccount;
    }()
  }, {
    key: "creditAccount",
    value: function () {
      var _creditAccount = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee5(req, res) {
        var user, cashier, accountNumber, amount, type, oldBalance, row, getAccountQuery, getTransactionQuery, creditQuery, _ref5, rows, _ref6, _rows, accountBalance, createdOn, transaction, response;

        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                user = _auth["default"].tokenBearer(req);
                cashier = user.userId;
                accountNumber = req.params.accountNumber;
                amount = req.body.amount;
                type = 'credit';

                if (!(!user.isAdmin && user.type.toLowerCase() === 'staff')) {
                  _context5.next = 39;
                  break;
                }

                getAccountQuery = 'SELECT * FROM  accounts WHERE accountNo = $1';
                getTransactionQuery = 'SELECT * FROM  transactions WHERE createdOn = (SELECT MAX(createdOn) FROM transactions WHERE accountNo = $1)';
                creditQuery = "INSERT INTO transactions(createdOn, type, accountNo, amount, cashier, accountBalance)  VALUES ($1, $2, $3, $4, $5, $6) \n      RETURNING *";
                _context5.prev = 9;
                _context5.next = 12;
                return _db["default"].query(getTransactionQuery, [accountNumber]);

              case 12:
                _ref5 = _context5.sent;
                rows = _ref5.rows;
                row = rows[0];

                if (row) {
                  _context5.next = 26;
                  break;
                }

                _context5.next = 18;
                return _db["default"].query(getAccountQuery, [accountNumber]);

              case 18:
                _ref6 = _context5.sent;
                _rows = _ref6.rows;
                row = _rows[0];

                if (row) {
                  _context5.next = 23;
                  break;
                }

                return _context5.abrupt("return", res.status(404).send({
                  status: 404,
                  data: 'Account does not exist'
                }));

              case 23:
                // postgres convert camel cases to lower case, nolonger openingBalance and accountBalance
                // but openingbalance and accountbalance
                oldBalance = row.openingbalance;
                _context5.next = 27;
                break;

              case 26:
                oldBalance = row.accountbalance;

              case 27:
                accountBalance = (+oldBalance + +amount).toFixed(2);
                createdOn = new Date();
                transaction = [createdOn, type.trim(), accountNumber, amount, cashier, accountBalance];
                _context5.next = 32;
                return _db["default"].query(creditQuery, transaction);

              case 32:
                response = _context5.sent;
                return _context5.abrupt("return", res.status(200).json({
                  status: 200,
                  message: "The account ".concat(accountNumber, " has been credited with ").concat(amount, " on ").concat(createdOn),
                  data: [response.rows[0]]
                }));

              case 36:
                _context5.prev = 36;
                _context5.t0 = _context5["catch"](9);
                return _context5.abrupt("return", res.status(500).send({
                  status: 500,
                  error: 'Unable to credit account!! Server Error, Please Try Again'
                }));

              case 39:
                return _context5.abrupt("return", res.status(409).json({
                  status: 409,
                  message: 'you must be a staff (Cashier) to perform this task'
                }));

              case 40:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[9, 36]]);
      }));

      function creditAccount(_x9, _x10) {
        return _creditAccount.apply(this, arguments);
      }

      return creditAccount;
    }()
  }, {
    key: "debitAccount",
    value: function () {
      var _debitAccount = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee6(req, res) {
        var user, cashier, accountNumber, amount, type, oldBalance, row, getAccountQuery, getTransactionQuery, creditQuery, _ref7, rows, _ref8, _rows2, accountBalance, createdOn, transaction, response;

        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                user = _auth["default"].tokenBearer(req);
                cashier = user.userId;
                accountNumber = req.params.accountNumber;
                amount = req.body.amount;
                type = 'debit';

                if (!(!user.isAdmin && user.type.toLowerCase() === 'staff')) {
                  _context6.next = 41;
                  break;
                }

                getAccountQuery = 'SELECT * FROM  accounts WHERE accountNo = $1';
                getTransactionQuery = 'SELECT * FROM  transactions WHERE createdOn = (SELECT MAX(createdOn) FROM transactions WHERE accountNo = $1)';
                creditQuery = "INSERT INTO transactions(createdOn, type, accountNo, amount, cashier, accountBalance)  VALUES ($1, $2, $3, $4, $5, $6) \n      RETURNING *";
                _context6.prev = 9;
                _context6.next = 12;
                return _db["default"].query(getTransactionQuery, [accountNumber]);

              case 12:
                _ref7 = _context6.sent;
                rows = _ref7.rows;
                row = rows[0];

                if (row) {
                  _context6.next = 26;
                  break;
                }

                _context6.next = 18;
                return _db["default"].query(getAccountQuery, [accountNumber]);

              case 18:
                _ref8 = _context6.sent;
                _rows2 = _ref8.rows;
                row = _rows2[0];

                if (row) {
                  _context6.next = 23;
                  break;
                }

                return _context6.abrupt("return", res.status(404).send({
                  status: 404,
                  data: 'Account does not exist'
                }));

              case 23:
                // postgres convert camel cases to lower case, nolonger openingBalance and accountBalance
                // but openingbalance and accountbalance
                oldBalance = row.openingbalance;
                _context6.next = 27;
                break;

              case 26:
                oldBalance = row.accountbalance;

              case 27:
                if (!(parseInt(oldBalance, 10) < parseInt(amount, 10))) {
                  _context6.next = 29;
                  break;
                }

                return _context6.abrupt("return", res.status(409).json({
                  status: 409,
                  message: 'Insufficient funds'
                }));

              case 29:
                accountBalance = (+oldBalance - +amount).toFixed(2);
                createdOn = new Date();
                transaction = [createdOn, type.trim(), accountNumber, amount, cashier, accountBalance];
                _context6.next = 34;
                return _db["default"].query(creditQuery, transaction);

              case 34:
                response = _context6.sent;
                return _context6.abrupt("return", res.status(200).json({
                  status: 200,
                  message: "The account ".concat(accountNumber, " has been debited of ").concat(amount, " on ").concat(createdOn),
                  data: [response.rows[0]]
                }));

              case 38:
                _context6.prev = 38;
                _context6.t0 = _context6["catch"](9);
                return _context6.abrupt("return", res.status(500).send({
                  status: 500,
                  error: 'Unable to credit account!! Server Error, Please Try Again'
                }));

              case 41:
                return _context6.abrupt("return", res.status(409).json({
                  status: 409,
                  message: 'you must be a staff (Cashier) to perform this task'
                }));

              case 42:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[9, 38]]);
      }));

      function debitAccount(_x11, _x12) {
        return _debitAccount.apply(this, arguments);
      }

      return debitAccount;
    }()
  }]);
  return StaffController;
}();

exports["default"] = StaffController;