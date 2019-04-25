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

var _helpers = _interopRequireDefault(require("../middleware/helpers"));

// import auth from '../middleware/auth';
var UserController =
/*#__PURE__*/
function () {
  function UserController() {
    (0, _classCallCheck2["default"])(this, UserController);
  }

  (0, _createClass2["default"])(UserController, null, [{
    key: "createUser",
    value: function () {
      var _createUser = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(req, res) {
        var hashedPassword, newUserQuery, values, _ref, rows, userToken;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // hash password to be dsaved on the database
                hashedPassword = _helpers["default"].hashPassword(req.body.password);
                newUserQuery = "INSERT INTO\n      users(firstname, lastname, email, type, password)\n      VALUES($1, $2, $3, $4, $5) \n      RETURNING user_id, firstname, lastname, email, type";
                values = [req.body.firstname.trim(), req.body.lastname.trim(), req.body.email.trim(), req.body.type.trim(), hashedPassword];
                _context.prev = 3;
                _context.next = 6;
                return _db["default"].query(newUserQuery, values);

              case 6:
                _ref = _context.sent;
                rows = _ref.rows;
                // generate user token used in verifying and authenticating the user
                userToken = _helpers["default"].generateToken(rows[0].user_id, rows[0].type, rows[0].isadmin, rows[0].email, rows[0].firstname, rows[0].lastname);
                return _context.abrupt("return", res.status(201).send({
                  status: 201,
                  data: [{
                    token: userToken,
                    user: {
                      user_id: rows[0].user_id,
                      firstname: rows[0].firstname,
                      lastname: rows[0].lastname,
                      email: rows[0].email
                    }
                  }]
                }));

              case 12:
                _context.prev = 12;
                _context.t0 = _context["catch"](3);

                if (!(_context.t0.routine === '_bt_check_unique')) {
                  _context.next = 16;
                  break;
                }

                return _context.abrupt("return", res.status(400).send({
                  status: 400,
                  error: "User with '".concat(req.body.email, "' already exists")
                }));

              case 16:
                return _context.abrupt("return", res.status(500).send({
                  status: 500,
                  error: _context.t0.message
                }));

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[3, 12]]);
      }));

      function createUser(_x, _x2) {
        return _createUser.apply(this, arguments);
      }

      return createUser;
    }()
  }, {
    key: "loginUser",
    value: function () {
      var _loginUser = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(req, res) {
        var query, _ref2, rows, comparePassword, userToken;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                query = 'SELECT * FROM users WHERE email = $1';
                _context2.prev = 1;
                _context2.next = 4;
                return _db["default"].query(query, [req.body.email]);

              case 4:
                _ref2 = _context2.sent;
                rows = _ref2.rows;

                if (rows[0]) {
                  _context2.next = 8;
                  break;
                }

                return _context2.abrupt("return", res.status(400).send({
                  status: 400,
                  error: 'Invalid User Credentials'
                }));

              case 8:
                // compares the password on request with password retrieved from db and returns a Boolean
                comparePassword = _helpers["default"].compareHashPassword(req.body.password, rows[0].password);

                if (comparePassword) {
                  _context2.next = 11;
                  break;
                }

                return _context2.abrupt("return", res.status(400).send({
                  status: 400,
                  error: 'Invalid User Credentials'
                }));

              case 11:
                // generates a token, using id, email and user isAdmin that can be used to identify the user
                userToken = _helpers["default"].generateToken(rows[0].user_id, rows[0].type, rows[0].isadmin, rows[0].email, rows[0].firstname, rows[0].lastname);
                return _context2.abrupt("return", res.status(200).send({
                  status: 200,
                  message: "".concat(rows[0].firstname, "  is successfully logged in"),
                  data: {
                    token: userToken,
                    user: {
                      user_id: rows[0].user_id,
                      firstname: rows[0].firstname,
                      lastname: rows[0].lastname,
                      email: rows[0].email
                    }
                  }
                }));

              case 15:
                _context2.prev = 15;
                _context2.t0 = _context2["catch"](1);
                return _context2.abrupt("return", res.status(500).send({
                  status: 500,
                  error: _context2.t0.message
                }));

              case 18:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[1, 15]]);
      }));

      function loginUser(_x3, _x4) {
        return _loginUser.apply(this, arguments);
      }

      return loginUser;
    }()
  }]);
  return UserController;
}();

var _default = UserController;
exports["default"] = _default;