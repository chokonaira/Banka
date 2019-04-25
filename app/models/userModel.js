import pool from '../db';
import helpers from '../middleware/helpers';

export default class UserModel {
  static async create(req, res) {
    const hashedPassword = helpers.hashPassword(req.body.password);
    const newUserQuery = `INSERT INTO users(firstname, lastname, email, type, password) VALUES($1, $2, $3, $4, $5) 
                          RETURNING user_id, firstname, lastname, email, type`;
    const { firstname, lastname, email, type } = req.body;
    const values = [firstname.trim(), lastname.trim(), email.trim(), type.trim(), hashedPassword];
    try {
      const { rows } = await pool.query(newUserQuery, values);
      return rows;
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({
          status: 400,
          error: `User already exist`,
        });
      }
      throw error;
    }
  }

  static async getUser(req, res) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [req.body.email];
    try {
      const { rows } = await pool.query(query, values);
      if (!rows[0]) {
        return res.status(404).send({
          status: 404,
          error: 'Invalid User Credentials',
        });
      }
      return rows;
    } catch (error) {
      throw error;
    }
  }
}
