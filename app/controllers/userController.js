import helpers from '../middleware/helpers';
import userModel from '../models/userModel';

class UserController {
  static async createUser(req, res) {
    try {
      const user = await userModel.create(req, res);
      if (user.length) {
        const {
          user_id, type, isadmin, email, firstname, lastname,
        } = user[0];
        const userToken = helpers.generateToken(user_id, type, isadmin, email, firstname, lastname);
        return res.status(201).send({
          status: 201,
          data: [{
            token: userToken,
            user: {
              user_id, firstname, lastname, email,
            },
          }],
        });
      }
      return null;
    } catch (error) {
      return res.status(500).send({
        status: 500,
        error: error.message,
      });
    }
  }

  static async loginUser(req, res) {
    try {
      const user = await userModel.getUser(req, res);
      if (user.length) {
        const comparePassword = helpers.compareHashPassword(req.body.password, user[0].password, res);
        if (comparePassword) {
          const {
            user_id, type, isadmin, email, firstname, lastname,
          } = user[0];
          const userToken = helpers.generateToken(user_id, type, isadmin, email, firstname, lastname);
          return res.status(200).send({
            status: 200,
            message: `${user[0].firstname}  is successfully logged in`,
            data:
            {
              token: userToken,
              user: {
                user_id, firstname, lastname, email,
              },
            },
          });
        }
      }
      return null;
    } catch (error) {
      return res.status(500).send({
        status: 500,
        error: error.message,
      });
    }
  }
}

export default UserController;
