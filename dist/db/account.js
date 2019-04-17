"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _shortid = _interopRequireDefault(require("shortid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = [{
  id: 1,
  owner: _shortid.default.generate(),
  firstname: 'john',
  lastname: 'doe',
  email: 'johndoe@gmail.com',
  type: 'savings',
  accountNumber: 1234567890,
  createdOn: '17/03/2019',
  status: 'active',
  openingBalance: 20000
}, {
  id: 2,
  owner: _shortid.default.generate(),
  firstname: 'doe',
  lastname: 'john',
  email: 'doejohn@gmail.com',
  type: 'savings',
  accountNumber: 987654321,
  createdOn: '17/03/2019',
  status: 'active',
  openingBalance: 20000
}];
exports.default = _default;