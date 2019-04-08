/* eslint-disable indent */
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

// eslint-disable-next-line no-undef
const secret = process.env.SECRET || 'secret';

const verifyUser = (req, res, next) => {
  const BearerToken = req.headers.authorization;
  const token = BearerToken.split(' ')[1];
  if (!token) {
    res.status(301).json({
      success: false,
      message: 'authentication failed, please login',
    });
  }

  try {
    const decoded = jwt.verify(token, secret);
    if (!decoded) {
      res.status(401).json({
        message: 'authentication failed',
      });
    }
    req.decoded = decoded;
    next();
  } catch (error) {
    res.status(400).json({
      message: 'invalid token, you are not a valid user',
    });
  }
};

export default verifyUser;
