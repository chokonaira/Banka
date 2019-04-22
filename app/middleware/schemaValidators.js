// Schema - Validating user request payload
import Joi from 'joi';

// Joi Validations Schema
const schema = {
  userSchema: Joi.object().keys({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().min(5).required(),
    type: Joi.string().required(),
  }),

  loginSchema: Joi.object().keys({
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().required(),
  }),

  accountsSchema: Joi.object().keys({
    type: Joi.string().required(),
    status: Joi.string().required(),
    openingBalance: Joi.number().required(),
  }),

  transactionsSchema: Joi.object().keys({
    amount: Joi.number().required(),
  }),

  activeDeactivateSchema: Joi.object().keys({
    status: Joi.string().required(),
  }),

};

function validate(schema) {
  return (req, res, next) => {
    Joi.validate(req.body, schema, { abortEarly: false }, (err) => {
      if (err) {
        return res.status(422).json({
          status: 422,
          error: err.details.map(m => m.message.replace(/[^a-zA-Z0-9 ]/g, '')),
        });
      }
      next();
      return null;
    });
  }
}

export { schema, validate };
