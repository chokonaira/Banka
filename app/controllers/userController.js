import pool from '../db';
import helpers from '../middleware/helpers';
// import auth from '../middleware/auth';


class UserController {
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

  static async loginUser(req, res) {
    const query = 'SELECT * FROM users WHERE email = $1';
    try {
      const { rows } = await pool.query(query, [req.body.email]);
      // Check for user existance in db
      if (!rows[0]) {
        return res.status(400).send({
          status: 400,
          error: 'Invalid User Credentials',
        });
      }

      // compares the password on request with password retrieved from db and returns a Boolean
      const comparePassword = helpers.compareHashPassword(req.body.password, rows[0].password);
      if (!comparePassword) {
        return res.status(400).send({
          status: 400,
          error: 'Invalid User Credentials',
        });
      }
      // generates a token, using id, email and user isAdmin that can be used to identify the user
      const userToken = helpers.generateToken(rows[0].user_id, rows[0].type, rows[0].isadmin,
        rows[0].email, rows[0].firstname, rows[0].lastname);
      return res.status(200).send({
        status: 200,
        message: `${rows[0].firstname}  is successfully logged in`,
        data: 
          {
            token: userToken,
            user: {
              user_id: rows[0].user_id,
              firstname: rows[0].firstname,
              lastname: rows[0].lastname,
              email: rows[0].email,
            },
          },
      });
    } catch (error) {
      return res.status(500).send({
        status: 500,
        error: error.message,
      });
    }
  }
}

export default UserController;
