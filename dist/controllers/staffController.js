"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _account = _interopRequireDefault(require("../db/account"));

var _transaction = _interopRequireDefault(require("../db/transaction"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var StaffController =
/*#__PURE__*/
function () {
  function StaffController() {
    _classCallCheck(this, StaffController);
  }

  _createClass(StaffController, null, [{
    key: "ActivatOrDeactivateAccct",
    value: function ActivatOrDeactivateAccct(req, res) {
      var isAdmin = req.decoded.isAdmin;
      var accountNumber = req.params.accountNumber;
      var status = req.body.status;
      var statusOptions = ['dormant', 'active'];

      if (!statusOptions.includes(status)) {
        return res.status(401).json({
          status: status !== 'dormant',
          statuss: 401,
          message: 'Invalid account status field, status should be "dormant" or "active"'
        });
      }

      if (isAdmin !== 'true') {
        return res.status(409).json({
          status: 409,
          message: 'only an admin is allow to perform this task'
        });
      }

      var account = _account.default.find(function (acct) {
        return acct.accountNumber === Number(accountNumber);
      });

      if (!account) {
        return res.status(404).json({
          status: 404,
          message: 'Selected account not found'
        });
      }

      account.status = req.body.status || account.status;
      return res.status(200).json({
        status: 200,
        data: {
          accountNumber: accountNumber,
          status: account.status
        }
      });
    }
    /**
     * deleteAccount()
     * @desc deletes a user account
     * @param {*} req
     * @param {*} res
     * @returns {object} deletedAccount
     */

  }, {
    key: "deleteAccount",
    value: function deleteAccount(req, res) {
      var isAdmin = req.decoded.isAdmin;
      var accountNumber = req.params.accountNumber;

      if (isAdmin !== 'true') {
        return res.status(409).json({
          status: 409,
          message: 'only an admin is allow to perform this task'
        });
      }

      for (var i = 0; i < _account.default.length; i += 1) {
        if (_account.default[i].accountNumber === Number(accountNumber)) {
          _account.default.splice(i, 1);

          return res.status(200).json({
            status: 200,
            message: 'seleted account successfully deleted'
          });
        }
      }

      return res.status(404).json({
        message: '404, account not found'
      });
    }
  }, {
    key: "creditAccount",
    value: function creditAccount(req, res) {
      var _req$decoded = req.decoded,
          firstname = _req$decoded.firstname,
          usertype = _req$decoded.type;
      var accountNumber = req.params.accountNumber;
      var createdOn = new Date();
      var _req$body = req.body,
          type = _req$body.type,
          amount = _req$body.amount;

      if (!type || !amount) {
        return res.status(400).json({
          status: 400,
          message: 'Validation error, All fields are required'
        });
      }

      var oldBalance;
      var transaction;

      if (usertype.toLowerCase() !== 'staff') {
        return res.status(409).json({
          status: 409,
          message: 'you must be a staff to perform this task'
        });
      }

      var acctExist = _account.default.find(function (account) {
        return account.accountNumber.toString() === accountNumber.toString();
      });

      if (!acctExist) {
        return res.status(404).json({
          status: 404,
          message: 'Account not found'
        });
      }

      var transactionExist = _transaction.default.find(function (trans) {
        return trans.accountNumber.toString() === accountNumber.toString();
      });

      if (!transactionExist) {
        var openingBalance = acctExist.openingBalance;
        oldBalance = openingBalance;
        transaction = {
          createdOn: createdOn,
          type: type,
          amount: amount,
          accountNumber: accountNumber,
          cashier: firstname,
          oldBalance: oldBalance,
          newBalance: +oldBalance + +amount
        };

        _transaction.default.push(transaction);

        return res.status(201).json({
          status: 201,
          message: "your account ".concat(accountNumber, " has been credited with ").concat(amount, " on ").concat(createdOn),
          data: transaction
        });
      }

      oldBalance = transactionExist.newBalance;
      var newBalance = +oldBalance + +amount;
      transaction = _objectSpread({}, transactionExist, {
        oldBalance: oldBalance,
        newBalance: newBalance,
        type: type
      });

      _transaction.default.forEach(function (trans, index, object) {
        if (trans.accountNumber.toString() === accountNumber.toString()) {
          object.splice(index, 1);
        }
      });

      _transaction.default.push(transaction);

      return res.status(201).json({
        status: 201,
        message: "your account ".concat(accountNumber, " has been credited with ").concat(amount, " on ").concat(createdOn),
        data: transaction
      });
    }
  }, {
    key: "debitAccount",
    value: function debitAccount(req, res) {
      var _req$decoded2 = req.decoded,
          firstname = _req$decoded2.firstname,
          usertype = _req$decoded2.type;
      var accountNumber = req.params.accountNumber;
      var createdOn = new Date();
      var _req$body2 = req.body,
          type = _req$body2.type,
          amount = _req$body2.amount;

      if (!type || !amount) {
        return res.status(400).json({
          status: 400,
          message: 'Validation error, All fields are required'
        });
      }

      var oldBalance = '';
      var newBalance = '';
      var transaction = {};

      if (usertype.toLowerCase() !== 'staff') {
        return res.status(409).json({
          status: 409,
          message: 'you must be a staff to perform this task'
        });
      }

      var acctExist = _account.default.find(function (account) {
        return account.accountNumber.toString() === accountNumber.toString();
      });

      if (!acctExist) {
        return res.status(404).json({
          status: 404,
          message: 'Account not found'
        });
      }

      var transactionExist = _transaction.default.find(function (trans) {
        return trans.accountNumber.toString() === accountNumber.toString();
      });

      if (!transactionExist) {
        var openingBalance = acctExist.openingBalance;
        oldBalance = openingBalance;

        if (oldBalance < amount) {
          return res.status(409).json({
            status: 409,
            message: 'Insufficient funds'
          });
        }

        transaction = {
          createdOn: createdOn,
          type: type,
          amount: amount,
          accountNumber: parseInt(accountNumber, 10),
          cashier: firstname,
          oldBalance: oldBalance,
          newBalance: +oldBalance - +amount
        };

        _transaction.default.push(transaction);

        return res.status(201).json({
          status: 201,
          message: "your account ".concat(accountNumber, " has been debited with ").concat(amount, " on ").concat(createdOn),
          data: transaction
        });
      }

      oldBalance = transactionExist.newBalance;

      if (oldBalance < amount) {
        return res.status(409).json({
          status: 409,
          message: 'Insufficient funds'
        });
      }

      newBalance = +oldBalance - +amount;
      transaction = _objectSpread({}, transactionExist, {
        oldBalance: oldBalance,
        newBalance: newBalance
      });

      _transaction.default.forEach(function (trans, index, object) {
        if (trans.accountNumber.toString() === accountNumber.toString()) {
          object.splice(index, 1);
        }
      });

      _transaction.default.push(transaction);

      return res.status(201).json({
        status: 201,
        message: "your account ".concat(accountNumber, " has been credited with ").concat(amount, " on ").concat(createdOn),
        data: transaction
      });
    }
  }]);

  return StaffController;
}();

exports.default = StaffController;