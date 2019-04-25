"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _routes = _interopRequireDefault(require("./routes"));

var app = (0, _express["default"])();
var PORT = process.env.PORT || 3000;
app.use(_bodyParser["default"].urlencoded({
  extended: false
}));
app.use(_bodyParser["default"].json());
app.use('/api/v1', _routes["default"]);
app.get('/', function (req, res) {
  res.status(200).send('Banka is a light-weight core banking application that powers banking operations like account creation, customer deposit and withdrawals. This app is meant to support a single bank, where users can signup and create bank accounts online, but must visit the branch to withdraw or deposit money..');
});
app.listen(PORT, function () {
  console.log("Server is running on port ".concat(PORT));
});
var _default = app;
exports["default"] = _default;