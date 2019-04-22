import jwt from 'jsonwebtoken';
import pool from '../db';

const auth = {
  async verifyToken(req, res, next) {
    const secret = process.env.SECRET || 'secret';
    const bearerToken = req.headers.authorization || '';
    const token = bearerToken.split(' ')[1]
    if (!token) {
      return res.status(401).send({
        status: 401,
        error: 'Token not Provided',
      });
    }
    try {
      const payload = await jwt.verify(token, secret);
      const query = 'SELECT * FROM users WHERE email = $1';
      const { rows } = await pool.query(query, [payload.email]);
      if (!rows[0]) {
        return res.status(401).send({
          status: 401,
          error: 'User not found',
        });
      }
      next();
      return null;
    } catch (error) {
      return res.status(401).send({
        status: 401,
        error: error.message,
      });
    }
  },

  tokenBearer(req) {
    const secret = process.env.SECRET || 'secret';
    const token = req.headers.authorization.split(' ')[1];
    const payload = jwt.verify(token, secret);
    return payload;
  },
};

export default auth;
