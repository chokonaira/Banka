"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* eslint-disable require-jsdoc */
var Validators =
/*#__PURE__*/
function () {
  function Validators() {
    _classCallCheck(this, Validators);
  }

  _createClass(Validators, null, [{
    key: "acctValidation",

    /**
           *
           * @param {*} req
           * @param {*} res
           * @param {*} next
           * @param {*} json
           * @param {*} message
           */
    value: function acctValidation(req, res, next) {
      var _req$body = req.body,
          type = _req$body.type,
          status = _req$body.status,
          openingBalance = _req$body.openingBalance;

      try {
        var regex = /^[a-zA-Z\s]*$/;

        if (status.trim() === '') {
          return res.status(400).json({
            message: ' status field cannot be empty'
          });
        }

        if (!regex.test(status)) {
          return res.status(400).json({
            message: 'status can only be letters'
          });
        }

        if (openingBalance.toString().trim() === '') {
          return res.status(400).json({
            message: 'opening balance cannot be empty'
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

        next();
        return true;
      } catch (error) {
        return res.status(400).json({
          status: 400,
          error: 'JSON object should contain {  type, status, openingBalance }'
        });
      }
    }
  }]);

  return Validators;
}();

exports.default = Validators;