"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = require("dotenv");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable indent */
(0, _dotenv.config)(); // eslint-disable-next-line no-undef

var secret = process.env.SECRET || 'secret';

var verifyUser = function verifyUser(req, res, next) {
  var BearerToken = req.headers.authorization;

  if (!BearerToken) {
    return res.status(401).json({
      success: false,
      message: 'authentication failed, please login'
    });
  }

  try {
    var token = BearerToken.split(' ')[1];

    var decoded = _jsonwebtoken.default.verify(token, secret);

    if (!decoded) {
      return res.status(401).json({
        message: 'authentication failed'
      });
    }

    req.decoded = decoded;
    next();
  } catch (error) {
    res.status(400).json({
      message: 'invalid token, you are not a valid user'
    });
  }

  return true;
};

var _default = verifyUser;
exports.default = _default;