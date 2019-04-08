import express from 'express';

import UserController from '../controllers/userController';
import Verifyuser from '../helpers/auth';
import Validator from '../middleware/formValidator';
import AccountValidator from '../middleware/accountValidator';


const router = express.Router();

const { createUser, userLogin } = UserController;
const { createAccount } = AccountController;

const { userValidation, loginValidation } = Validator;
const { acctValidation } = AccountValidator;


// client routes
router.post('/auth/signup', userValidation, createUser);
router.post('/auth/login', loginValidation, userLogin);
router.post('/accounts', acctValidation, Verifyuser, createAccount);





export default router;
