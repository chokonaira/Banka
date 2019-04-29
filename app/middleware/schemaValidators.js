import Joi from 'joi';

const schema = {
  userSchema: Joi.object().keys({
    firstname: Joi.string().regex(/^[a-z]+$/, { name: 'letters only' }).max(12).required()
      .error(() => ({
        message: 'Firstname can only be letters',
      })),
    lastname: Joi.string().regex(/^[a-z]+$/, { name: 'letters only' }).max(12).required()
      .error(() => ({
        message: 'Lastname can only be letters',
      })),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().regex(/^[a-z0-9]+$/, 'letters and numbers only').min(5).required()
      .error(() => ({
        message: 'Invalid password, password can only be letters or numbers',
      })),
  }),


  loginSchema: Joi.object().keys({
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().regex(/^[a-z0-9]+$/, 'letters and numbers only').min(5).required()
      .error(() => ({
        message: 'Invalid password, password can only be letters or numbers',
      })),
  }),

  accountsSchema: Joi.object().keys({
    type: Joi.string().required(),
    openingBalance: Joi.number().positive().allow(0).required(),
  }),

  transactionsSchema: Joi.object().keys({
    amount: Joi.number().positive().allow(0).required(),
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
          error: err.details[0].message || err.details,
        });
      }
      next();
      return null;
    });
  };
}

export { schema, validate };