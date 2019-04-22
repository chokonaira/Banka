import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const helpers = {
  /**
   * Hashing user password
   * @param {*} password
   * @returns
   * returns a hashed password.
   */
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  },
  /**
 * Compares the password with hashed password
 * @param {*} password
 * @param {*} hashPassword
 * @returns
 * a Boolean True or False
 */
  compareHashPassword(password, hashPassword) {
    return bcrypt.compareSync(password, hashPassword);
  },
  /**
 * Encrpyts a set of information that can be transmited
 * inorder to authenticate a particular user
 * @param {*} id
 * @param {*} email
 * @param {*} adminStatus
 * @returns
 * token
 */
  generateToken(userId, type, isAdmin, email, firstname, lastname) {
    const token = jwt.sign({
      userId, type, isAdmin, email, firstname, lastname,
    }, process.env.SECRET, { expiresIn: '24h' });
    return token;
  },
};

export default helpers;
