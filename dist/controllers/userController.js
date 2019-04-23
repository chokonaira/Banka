"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _shortid = _interopRequireDefault(require("shortid"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = require("dotenv");

var _user = _interopRequireDefault(require("../db/user"));

var _userValidator = require("../middleware/userValidator");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(0, _dotenv.config)();
var secret = process.env.SECRET || 'secret';

var UserController =
/*#__PURE__*/
function () {
  function UserController() {
    _classCallCheck(this, UserController);
  }

  _createClass(UserController, null, [{
    key: "createUser",
    value: function createUser(req, res) {
      var password = _bcrypt.default.hashSync(req.body.password, 10);

      var _req$body = req.body,
          firstname = _req$body.firstname,
          lastname = _req$body.lastname,
          email = _req$body.email,
          type = _req$body.type,
          isAdmin = _req$body.isAdmin;

      var isExit = _user.default.find(function (user) {
        return user.email === email.toLowerCase();
      });

      if (isExit) {
        return res.status(409).json({
          message: 'User with this email already exist'
        });
      }

      var data = {
        id: _shortid.default.generate(),
        firstname: firstname.toLowerCase(),
        lastname: lastname.toLowerCase(),
        email: email.toLowerCase(),
        type: type.toLowerCase(),
        isAdmin: isAdmin,
        password: password
      };
      var id = data.id;

      var token = _jsonwebtoken.default.sign({
        id: id,
        type: type,
        isAdmin: isAdmin,
        email: email,
        firstname: firstname,
        lastname: lastname
      }, secret, {
        expiresIn: '10h'
      });

      _user.default.push(data);

      return res.status(201).json({
        status: 201,
        data: {
          token: token,
          id: id,
          firstname: firstname,
          lastname: lastname,
          email: email,
          isAdmin: isAdmin,
          type: type
        }
      });
    }
  }, {
    key: "userLogin",
    value: function userLogin(req, res) {
      var _req$body2 = req.body,
          password = _req$body2.password,
          email = _req$body2.email;
      (0, _userValidator.loginFieldRequiredValidation)(email, password, res);

      var User = _user.default.find(function (user) {
        return user.email === email.toLowerCase();
      });

      if (!User) {
        return res.status(404).json({
          status: 404,
          message: 'user with this email and password does not exist'
        });
      }

      var id = User.id,
          type = User.type,
          isAdmin = User.isAdmin,
          firstname = User.firstname,
          lastname = User.lastname;

      var token = _jsonwebtoken.default.sign({
        id: id,
        type: type,
        isAdmin: isAdmin,
        email: email,
        firstname: firstname,
        lastname: lastname
      }, secret, {
        expiresIn: '10h'
      });

      return res.status(200).json({
        message: "".concat(firstname, "  is successfully logged in"),
        data: {
          token: token,
          id: User.id,
          firstname: User.firstname,
          lastname: User.lastname,
          email: User.email
        }
      });
    }
  }]);

  return UserController;
}();

exports.default = UserController;