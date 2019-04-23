"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _accountController = _interopRequireDefault(require("../controllers/accountController"));

var _staffController = _interopRequireDefault(require("../controllers/staffController"));

var _userController = _interopRequireDefault(require("../controllers/userController"));

var _auth = _interopRequireDefault(require("../helpers/auth"));

var _formValidator = _interopRequireDefault(require("../middleware/formValidator"));

var _accountValidator = _interopRequireDefault(require("../middleware/accountValidator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express.default.Router();

var createUser = _userController.default.createUser,
    userLogin = _userController.default.userLogin;
var createAccount = _accountController.default.createAccount;
var ActivatOrDeactivateAccct = _staffController.default.ActivatOrDeactivateAccct,
    deleteAccount = _staffController.default.deleteAccount,
    creditAccount = _staffController.default.creditAccount,
    debitAccount = _staffController.default.debitAccount;
var userValidation = _formValidator.default.userValidation,
    loginValidation = _formValidator.default.loginValidation;
var acctValidation = _accountValidator.default.acctValidation; // client routes

router.post('/auth/signup', userValidation, createUser);
router.post('/auth/login', loginValidation, userLogin);
router.post('/accounts', acctValidation, _auth.default, createAccount); // cashier routes

router.post('/transactions/:accountNumber/credit', _auth.default, creditAccount);
router.post('/transactions/:accountNumber/debit', _auth.default, debitAccount); // admin routes

router.patch('/accounts/:accountNumber', _auth.default, ActivatOrDeactivateAccct);
router.delete('/accounts/:accountNumber', _auth.default, deleteAccount);
var _default = router;
exports.default = _default;