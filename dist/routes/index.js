"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _accountController = _interopRequireDefault(require("../controllers/accountController"));

var _staffController = _interopRequireDefault(require("../controllers/staffController"));

var _userController = _interopRequireDefault(require("../controllers/userController"));

var _schemaValidators = require("../middleware/schemaValidators");

var _auth = _interopRequireDefault(require("../middleware/auth"));

var _url = _interopRequireDefault(require("../middleware/url"));

var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));

var _swagger = _interopRequireDefault(require("../../swagger.json"));

var router = _express["default"].Router();

var createUser = _userController["default"].createUser,
    loginUser = _userController["default"].loginUser;
var createAccount = _accountController["default"].createAccount,
    accountDetails = _accountController["default"].accountDetails,
    getAllTransactions = _accountController["default"].getAllTransactions,
    getTransaction = _accountController["default"].getTransaction;
var ActivatOrDeactivateAccct = _staffController["default"].ActivatOrDeactivateAccct,
    getAllAccounts = _staffController["default"].getAllAccounts,
    deleteAccount = _staffController["default"].deleteAccount,
    creditAccount = _staffController["default"].creditAccount,
    debitAccount = _staffController["default"].debitAccount,
    getUserAccounts = _staffController["default"].getUserAccounts;
var verifyToken = _auth["default"].verifyToken;
var verifyAccountNumber = _url["default"].verifyAccountNumber; // client routes

router.post('/auth/signup', (0, _schemaValidators.validate)(_schemaValidators.schema.userSchema), createUser);
router.post('/auth/login', (0, _schemaValidators.validate)(_schemaValidators.schema.loginSchema), loginUser);
router.post('/accounts', (0, _schemaValidators.validate)(_schemaValidators.schema.accountsSchema), verifyToken, createAccount);
router.get('/accounts/:accountNumber', verifyAccountNumber, verifyToken, accountDetails);
router.get('/accounts/:accountNumber/transactions', verifyAccountNumber, verifyToken, getAllTransactions);
router.get('/transactions/:transactionId', verifyToken, getTransaction);
router.use('/docs', _swaggerUiExpress["default"].serve, _swaggerUiExpress["default"].setup(_swagger["default"])); // cashier routes

router.post('/transactions/:accountNumber/credit', (0, _schemaValidators.validate)(_schemaValidators.schema.transactionsSchema), verifyAccountNumber, verifyToken, creditAccount);
router.post('/transactions/:accountNumber/debit', (0, _schemaValidators.validate)(_schemaValidators.schema.transactionsSchema), verifyAccountNumber, verifyToken, debitAccount); // admin routes

router.patch('/accounts/:accountNumber', (0, _schemaValidators.validate)(_schemaValidators.schema.activeDeactivateSchema), verifyAccountNumber, verifyToken, ActivatOrDeactivateAccct);
router["delete"]('/accounts/:accountNumber', verifyAccountNumber, verifyToken, deleteAccount);
router.get('/accounts', verifyToken, getAllAccounts);
router.get('/user/:userEmail/accounts', verifyToken, getUserAccounts);
var _default = router;
exports["default"] = _default;