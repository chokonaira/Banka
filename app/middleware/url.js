const url = {
  async verifyAccountNumber(req, res, next) {
    const { accountNumber } = req.params;
    if (accountNumber.toString().length === 9) {
      next();
      return null;
    }
    return res.status(409).json({
      status: 409,
      error: 'Invalid account number, account number must be 9 digits long'
    });
  },
};

export default url;
