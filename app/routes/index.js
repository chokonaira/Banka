import express from 'express';

import UserController from '../controllers/userController';
import AccountController from '../controllers/accountController';
import StaffController from '../controllers/staffController';
import Verifyuser from '../helpers/auth';
import Validator from '../middleware/formValidator';
import AccountValidator from '../middleware/accountValidator';


const router = express.Router();

const { createUser, userLogin } = UserController;
const { createAccount } = AccountController;
const {ActivatOrDeactivateAccct, deleteAccount, creditAccount, debitAccount} = StaffController;

const { userValidation, loginValidation } = Validator;
const { acctValidation } = AccountValidator;



// client routes
router.post('/auth/signup', userValidation, createUser);
router.post('/auth/login', loginValidation, userLogin);
router.post('/accounts', acctValidation, Verifyuser, createAccount);

// Admin routes
router.patch('/accounts/:accountNumber', Verifyuser, ActivatOrDeactivateAccct);
router.delete('/accounts/:accountNumber', Verifyuser, deleteAccount);

// cashier routes
router.post('/transactions/:accountNumber/credit', Verifyuser, creditAccount);
router.post('/transactions/:accountNumber/debit', Verifyuser, debitAccount);





export default router;
