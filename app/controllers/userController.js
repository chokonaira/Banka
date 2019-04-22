import pool from '../db';
import helpers from '../middleware/helpers';
// import auth from '../middleware/auth';


config();
const secret = process.env.SECRET || 'secret';

export default class UserController {
  static async createUser(req, res) {
    // hash password to be dsaved on the database
    const hashedPassword = helpers.hashPassword(req.body.password);

    const newUserQuery = `INSERT INTO
      users(firstname, lastname, email, type, password)
      VALUES($1, $2, $3, $4, $5) 
      RETURNING user_id, firstname, lastname, email, type`;
    const values = [
      req.body.firstname.trim(),
      req.body.lastname.trim(),
      req.body.email.trim(),
      req.body.type.trim(),
      hashedPassword,
    ];

    try {
      const { rows } = await pool.query(newUserQuery, values);
      // generate user token used in verifying and authenticating the user
      const userToken = helpers.generateToken(rows[0].user_id, rows[0].type, rows[0].isadmin,
        rows[0].email, rows[0].firstname, rows[0].lastname);
      return res.status(201).send({
        status: 201,
        data: [{
          token: userToken,
          user: {
            user_id: rows[0].user_id,
            firstname: rows[0].firstname,
            lastname: rows[0].lastname,
            email: rows[0].email,
          },
        }],
      });
    } catch (error) {
      // get unique email error from db and returns a more descriptive message
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({
          status: 400,
          error: `User with '${req.body.email}' already exists`,
        });
      }
      return res.status(500).send({
        status: 500,
        error: error.message,
      });
    }
  }

  static userLogin(req, res) {
    const { password, email } = req.body;
    loginFieldRequiredValidation(email, password, res);

    const User = userDb
      .find(user => user.email === email.toLowerCase());

    if (!User) {
      return res.status(404).json({
        status: 404,
        message: 'user with this email and password does not exist',
      });
    }

    const {
      id, type, isAdmin, firstname, lastname,
    } = User;
    const token = jwt.sign({
      id, type, isAdmin, email, firstname, lastname,
    }, secret, { expiresIn: '10h' });
    return res.status(200).json({
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
