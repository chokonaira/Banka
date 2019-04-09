const userFieldRequiredValidation = (firstname, lastname, email, type, password, isAdmin, res) => {
  if (!firstname || !lastname || !email || !type || !password || !isAdmin) {
    return res.status(400).send({
      success: 'false',
      message: 'Validation error: all fields are required',
    });
  }
  return true;
};


export const loginFieldRequiredValidation = (email, password, res) => {
  if (!email || !password) {
    return res.status(400).send({
      success: 'false',
      message: 'field required',
    });
  }
  return true;
};

export default userFieldRequiredValidation;
