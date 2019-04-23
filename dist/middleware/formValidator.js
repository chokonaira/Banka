"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* eslint-disable require-jsdoc */
var Validator =
/*#__PURE__*/
function () {
  function Validator() {
    _classCallCheck(this, Validator);
  }

  _createClass(Validator, null, [{
    key: "userValidation",

    /**
         *
         * @param {*} req
         * @param {*} res
         * @param {*} next
         * @param {*} json
         * @param {*} message
         */
    value: function userValidation(req, res, next) {
      var _req$body = req.body,
          firstname = _req$body.firstname,
          lastname = _req$body.lastname,
          email = _req$body.email,
          type = _req$body.type,
          isAdmin = _req$body.isAdmin;

      try {
        var regex = /^[a-zA-Z\s]*$/;

        if (firstname.trim() === '') {
          return res.status(400).json({
            message: ' firstname field cannot be empty'
          });
        }

        if (!regex.test(firstname)) {
          return res.status(400).json({
            message: 'firstname can only be letters'
          });
        }

        if (lastname.trim() === '') {
          return res.status(400).json({
            message: 'lastname cannot be empty'
          });
        }

        if (!regex.test(lastname)) {
          return res.status(400).json({
            message: 'lastname can only be letters'
          });
        }

        if (email.trim() === '') {
          return res.status(400).json({
            message: 'email cannot be empty'
          });
        }

        if (type.trim() === '') {
          return res.status(400).json({
            message: 'type cannot be empty'
          });
        }

        if (!regex.test(type)) {
          return res.status(400).json({
            message: 'type can only be letters'
          });
        }

        if (isAdmin === '') {
          return res.status(400).json({
            message: 'isAdmin cannot be empty'
          });
        }

        if (!regex.test(isAdmin)) {
          return res.status(400).json({
            message: 'isAdmin can only be letters'
          });
        }

        next();
        return true;
      } catch (error) {
        return res.status(400).json({
          status: 400,
          error: 'JSON object should contain { firstname, lastname, email, password,type,isAdmin }'
        });
      }
    }
  }, {
    key: "loginValidation",
    value: function loginValidation(req, res, next) {
      var _req$body2 = req.body,
          email = _req$body2.email,
          password = _req$body2.password;

      try {
        if (password.trim() === '') {
          return res.status(400).json({
            message: ' firstname field cannot be empty'
          });
        }

        if (email.trim() === '') {
          return res.status(400).json({
            message: 'email cannot be empty'
          });
        }

        next();
        return true;
      } catch (error) {
        return res.status(400).json({
          status: 400,
          error: 'JSON object should contain {  email, password }'
        });
      }
    }
  }]);

  return Validator;
}();

exports.default = Validator;