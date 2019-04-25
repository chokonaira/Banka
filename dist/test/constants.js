"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  testUser: {
    firstname: 'Test',
    lastname: 'User',
    email: 'testuser@gmail.com',
    type: 'user',
    password: 'password',
    isAdmin: 'false'
  },
  testCashier: {
    firstname: 'Test',
    lastname: 'Cashier',
    email: 'testcashier@gmail.com',
    type: 'staff',
    password: 'password',
    isAdmin: 'false'
  },
  testAdmin: {
    firstname: 'Test',
    lastname: 'Admin',
    email: 'testadmin@gmail.com',
    type: 'staff',
    password: 'password',
    isAdmin: 'true'
  },
  newAccount: {
    type: 'current',
    status: 'active',
    openingBalance: 50000
  },
  invalidToken: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVkfifCJ9.eyJ1c2VySWQiOjEsInR5cGUiOiJ1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImVtYWlsIjoidGVzdHVzZXJAZ21haWwuY29tIiwiZmlyc3RuYW1lIjoiVGVzdCIsImxhc3RuYW1lIjoiVXNlciIsImlhdCI6MTU1NTcxMDM4OCwiZXhwIjoxNTU1Nzk2Nzg4fQ.8T46DExGVFj2gux32bgVn_XBcR5RkuYZ54OQnusHKD8',
  validToken: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInR5cGUiOiJ1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImVtYWlsIjoia2luZ3NAZ21haWwuY29tIiwiZmlyc3RuYW1lIjoiQ2h1a3d1IiwibGFzdG5hbWUiOiJBcmluemUiLCJpYXQiOjE1NTU2OTk4ODAsImV4cCI6MTU1NTc4NjI4MH0.O81z1l5vArF0HDRdMMi6vP0L5gY-VI0ytrlW-M7vDlc',
  invalidAccountNumber: '1234567890',
  validAcccountNumber: '123456789',
  invalidEmail: 'email@gmail.com',
  validEmail: 'testuser@gmail.com'
};
exports["default"] = _default;