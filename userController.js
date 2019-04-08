/* eslint-disable require-jsdoc */
import shortid from 'shortid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import userDb from '../db/user';
import UserFieldRequired, { loginFieldRequiredValidation } from '../middleware/userValidator';


config();
const secret = process.env.SECRET || 'superSecretKey';

export default class UserController {
  static createUser(req, res) {
    const password = bcrypt.hashSync(req.body.password, 10);
    const {
      firstname, lastname, email, type, isAdmin,
    } = req.body;

    UserFieldRequired(firstname, lastname, email, type, password, isAdmin, res);
    const isExit = userDb.find(user => user.email === email.toLowerCase());

    if (isExit) {
      return res.status(409).json({
        message: 'User with this email already exist',
      });
    }

    const data = {
      id: shortid.generate(),
      firstname: firstname.toLowerCase(),
      lastname: lastname.toLowerCase(),
      email: email.toLowerCase(),
      type: type.toLowerCase(),
      isAdmin,
      password,
    };
    const { id } = data;
    const token = jwt.sign({
      id, type, isAdmin, email, firstname, lastname,
    }, secret, { expiresIn: '10h' });

    userDb.push(data);
    return res.status(201).json({
      status: 201,
      data: {
        token,
        id,
        firstname,
        lastname,
        email,
        isAdmin,
        type,
      },

    });
  }

  static userLogin(req, res) {
    const { password, email } = req.body;
    loginFieldRequiredValidation(email, password, res);

    const User = userDb.find(user => user.email === email.toLowerCase());

    if (!User) {
      return res.status(400).json({
        status: 404,
        message: 'user with this email does not exist',
      });
    }

    const {
      id, type, isAdmin, firstname, lastname,
    } = User;
    const token = jwt.sign({
      id, type, isAdmin, email, firstname, lastname,
    }, secret, { expiresIn: '10h' });
    return res.status(201).json({
      message: `${firstname}  is successfully logged in`,
      data: {
        token,
        id: User.id,
        firstname: User.firstname,
        lastname: User.lastname,
        email: User.email,
      },

    });
  }
}