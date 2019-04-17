"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _shortid = _interopRequireDefault(require("shortid"));

var _account = _interopRequireDefault(require("../db/account"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Account =
/*#__PURE__*/
function () {
  function Account() {
    _classCallCheck(this, Account);
  }

  _createClass(Account, null, [{
    key: "createAccount",
    value: function createAccount(req, res) {
      var _req$decoded = req.decoded,
          firstname = _req$decoded.firstname,
          email = _req$decoded.email,
          lastname = _req$decoded.lastname,
          id = _req$decoded.id;
      var ownerId = id;
      var accountNumber = Math.floor(Math.random() * 1000000000);
      var date = new Date();
      var _req$body = req.body,
          type = _req$body.type,
          status = _req$body.status,
          openingBalance = _req$body.openingBalance;

      if (!type || !status || !openingBalance) {
        return res.status(400).send({
          success: 'false',
          message: 'field required'
        });
      }

      var acctExist = _account.default.filter(function (acct) {
        return acct.email === email.toLowerCase();
      });

      if (!acctExist.length < 1) {
        return res.status(409).json({
          message: 'account already exist'
        });
      }

      var data = {
        id: _shortid.default.generate(),
        ownerId: ownerId,
        firstname: firstname,
        accountNumber: accountNumber,
        lastname: lastname,
        email: email,
        date: date,
        type: type,
        status: status,
        openingBalance: openingBalance
      };

      _account.default.push(data);

      return res.status(201).json({
        status: 201,
        message: 'Account created successfully',
        data: {
          date: date,
          accountNumber: accountNumber,
          firstname: firstname,
          lastname: lastname,
          email: email,
          type: type,
          openingBalance: openingBalance
        }
      });
    }
  }]);

  return Account;
}();

exports.default = Account;