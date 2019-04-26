import jwt from 'jsonwebtoken';
import pool from '../db';

export function tokenBearer(req) {
  const secret = process.env.SECRET || 'secret';
  const token = req.headers.authorization.split(' ')[1];
  const payload = jwt.verify(token, secret);
  return payload;
}

export default class AuthMiddleware {
  static async verifyToken(req, res, next) {
    const secret = process.env.SECRET || 'secret';
    const bearerToken = req.headers.authorization || '';
    const token = bearerToken.split(' ')[1];
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
  }

  static isAdmin(req, res, next) {
    const payload = tokenBearer(req);
    const { isAdmin, type } = payload;
    if (isAdmin && type.toLowerCase() === 'staff') {
      req.user = payload;
      next();
    } else {
      return res.status(401).json({
        status: 401,
        error: 'Access denied',
      });
    }
    return null;
  }

  static isCashier(req, res, next) {
    const payload = tokenBearer(req);
    const { isAdmin, type } = payload;
    if (!isAdmin && type.toLowerCase() === 'staff') {
      req.user = payload;
      next();
    } else {
      return res.status(401).json({
        status: 401,
        error: 'Access denied',
      });
    }
    return null;
  }

  static isUser(req, res, next) {
    const payload = tokenBearer(req);
    const { isAdmin, type } = payload;
    if (!isAdmin && type.toLowerCase() === 'user') {
      req.user = payload;
      next();
    } else {
      return res.status(401).json({
        status: 401,
        error: 'Access denied',
      });
    }
    return null;
  }
}
