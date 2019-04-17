"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.loginFieldRequiredValidation = void 0;

var userFieldRequiredValidation = function userFieldRequiredValidation(firstname, lastname, email, type, password, isAdmin, res) {
  if (!firstname || !lastname || !email || !type || !password || !isAdmin) {
    return res.status(400).send({
      success: 'false',
      message: 'Validation error: all fields are required'
    });
  }

  return true;
};

var loginFieldRequiredValidation = function loginFieldRequiredValidation(email, password, res) {
  if (!email || !password) {
    return res.status(400).send({
      success: 'false',
      message: 'field required'
    });
  }

  return true;
};

exports.loginFieldRequiredValidation = loginFieldRequiredValidation;
var _default = userFieldRequiredValidation;
exports.default = _default;