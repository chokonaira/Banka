import Joi from 'joi';

const schema = {
  userSchema: Joi.object().keys({
    firstname: Joi.string().regex(/^[a-z]+$/, { name: 'letters only' }).max(12).required(),
    lastname: Joi.string().regex(/^[a-z]+$/, { name: 'letters only' }).max(12).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().regex(/\s/, { invert: true, name: 'no white spaces' }).min(5).required()
  }),


  loginSchema: Joi.object().keys({
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().regex(/\s/, { invert: true, name: 'no white spaces' }).min(5).required()
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
          error: err.details.map(m => m.message.replace(/[^a-zA-Z0-9 ]/g, '')),
        });
      }
      next();
      return null;
    });
  }
}

export { schema, validate };
