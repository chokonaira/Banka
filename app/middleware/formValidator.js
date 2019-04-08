/* eslint-disable require-jsdoc */

export default class Validator {
  /**
       *
       * @param {*} req
       * @param {*} res
       * @param {*} next
       * @param {*} json
       * @param {*} message
       */


  static userValidation(req, res, next) {
    const {
      firstname, lastname, email, type, isAdmin,
    } = req.body;
    try {
      const regex = /^[a-zA-Z\s]*$/;
      if (firstname.trim() === '') {
        return res.status(400).json({ message: ' firstname field cannot be empty' });
      }
      if (!regex.test(firstname)) {
        return res
          .status(400)
          .json({ message: 'firstname can only be letters' });
      }
      if (lastname.trim() === '') {
        return res.status(400).json({ message: 'lastname cannot be empty' });
      }
      if (!regex.test(lastname)) {
        return res
          .status(400)
          .json({ message: 'lastname can only be letters' });
      }

      if (email.trim() === '') {
        return res
          .status(400)
          .json({ message: 'email cannot be empty' });
      }
      if (type.trim() === '') {
        return res
          .status(400)
          .json({ message: 'type cannot be empty' });
      }
      if (!regex.test(type)) {
        return res
          .status(400)
          .json({ message: 'type can only be letters' });
      }
      if (isAdmin.trim() === '') {
        return res
          .status(400)
          .json({ message: 'isAdmin cannot be empty' });
      }
      if (!regex.test(isAdmin)) {
        return res
          .status(400)
          .json({ message: 'isAdmin can only be letters' });
      }
      next();
      return true;
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error: 'JSON object should contain { firstname, lastname, email, password,type,isAdmin }',
      });
    }
  }

  static loginValidation(req, res, next) {
    const {
      email, password,
    } = req.body;
    try {
      if (password.trim() === '') {
        return res.status(400).json({ message: ' firstname field cannot be empty' });
      }

      if (email.trim() === '') {
        return res
          .status(400)
          .json({ message: 'email cannot be empty' });
      }
      next();
      return true;
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error: 'JSON object should contain {  email, password }',
      });
    }
  }
}
