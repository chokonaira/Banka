import express from 'express';

import AccountController from '../controllers/accountController';
import AdminController from '../controllers/adminController';
import CashierController from '../controllers/cashierController';
import UserController from '../controllers/userController';
import { schema, validate } from '../middleware/schemaValidators';
import Auth from '../middleware/auth';
import urlMiddleware from '../middleware/url';


const router = express.Router();

const { createUser, loginUser } = UserController;
const { createAccount, accountDetails, getAllTransactions, getTransaction } = AccountController;
const {
  ActivatOrDeactivateAccct, getAllAccounts, deleteAccount, getUserAccounts,
} = AdminController;
const { debitAccount, creditAccount } = CashierController;
const {
  verifyToken, isAdmin, isCashier, isUser,
} = Auth;
const { verifyAccountNumber } = urlMiddleware;

// client routes
router.post('/auth/signup', validate(schema.userSchema), createUser);
router.post('/auth/login', validate(schema.loginSchema), loginUser);
router.post('/accounts', verifyToken, isUser, validate(schema.accountsSchema), createAccount);
router.get('/accounts/:accountNumber', verifyToken, isUser, verifyAccountNumber, accountDetails);
router.get('/accounts/:accountNumber/transactions',verifyToken, isUser, verifyAccountNumber, getAllTransactions);
router.get('/transactions/:transactionId', verifyToken, isUser, getTransaction);


// cashier routes
router.post('/transactions/:accountNumber/credit', verifyToken, isCashier, validate(schema.transactionsSchema), verifyAccountNumber, creditAccount);
router.post('/transactions/:accountNumber/debit', verifyToken, isCashier, validate(schema.transactionsSchema), verifyAccountNumber, debitAccount);

// admin routes
router.patch('/accounts/:accountNumber', verifyToken, isAdmin, validate(schema.activeDeactivateSchema), verifyAccountNumber, ActivatOrDeactivateAccct);
router.delete('/accounts/:accountNumber', verifyToken, isAdmin, verifyAccountNumber, deleteAccount);
router.get('/accounts', verifyToken, isAdmin, getAllAccounts);
router.get('/user/:userEmail/accounts', verifyToken, isAdmin, getUserAccounts);


export default router;