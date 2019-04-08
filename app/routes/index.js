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

const { userValidation, loginValidation } = Validator;
const { acctValidation } = AccountValidator;
const {
  ActivatOrDeactivateAccct
} = StaffController;


// client routes
router.post('/auth/signup', userValidation, createUser);
router.post('/auth/login', loginValidation, userLogin);
router.post('/accounts', acctValidation, Verifyuser, createAccount);

// Admin routes
router.patch('/accounts/:accountNumber', Verifyuser, ActivatOrDeactivateAccct);
router.delete('/accounts/:accountNumber', Verifyuser, deleteAccount);





export default router;
