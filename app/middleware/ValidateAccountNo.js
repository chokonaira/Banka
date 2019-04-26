const url = {
  async verifyAccountNumber(req, res, next) {
    const { accountNumber } = req.params;
    const regex = new RegExp('^[0-9]+$');
    if (accountNumber.toString().length === 9 && regex.test(accountNumber)) {
      next();
    }
    return res.status(400).json({
      status: 400,
      error: 'Invalid account number'
    });
  },
};

export default url;
