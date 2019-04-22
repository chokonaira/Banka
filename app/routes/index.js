import express from 'express';

import AccountController from '../controllers/accountController';
import StaffController from '../controllers/staffController';
import UserController from '../controllers/userController';
import { schema, validate } from '../middleware/schemaValidators';
import Auth from '../middleware/auth';
import urlMiddleware from '../middleware/url';


const router = express.Router();

const { createUser, loginUser } = UserController;
const { createAccount, getAllTransactions, getTransaction } = AccountController;
const {
  ActivatOrDeactivateAccct, getAllAccounts, deleteAccount, creditAccount,
  debitAccount, getUserAccounts,
} = StaffController;
const { verifyToken } = Auth;
const { verifyAccountNumber } = urlMiddleware;

// client routes
router.post('/auth/signup', validate(schema.userSchema), createUser);
router.post('/auth/login', validate(schema.loginSchema), loginUser);
router.post('/accounts', validate(schema.accountsSchema), verifyToken, createAccount);
router.get('/accounts/:accountNumber/transactions', verifyAccountNumber, verifyToken, getAllTransactions);
router.get('/transactions/:transactionId', verifyToken, getTransaction);

// cashier routes
router.post('/transactions/:accountNumber/credit', validate(schema.transactionsSchema), verifyAccountNumber, verifyToken, creditAccount);
router.post('/transactions/:accountNumber/debit', validate(schema.transactionsSchema), verifyAccountNumber, verifyToken, debitAccount);

// admin routes
router.patch('/accounts/:accountNumber', validate(schema.activeDeactivateSchema), verifyAccountNumber, verifyToken, ActivatOrDeactivateAccct);
router.delete('/accounts/:accountNumber', verifyAccountNumber, verifyToken, deleteAccount);
router.get('/accounts', verifyToken, getAllAccounts);
router.get('/user/:userEmail/accounts', verifyToken, getUserAccounts);


export default router;
