import express from 'express';

import UserController from '../controllers/userController';

const router = express.Router();

const { createUser, userLogin } = UserController;


// client routes
router.post('/auth/signup', userValidation, createUser);



export default router;
