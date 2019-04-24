const url = {
  async verifyAccountNumber(req, res, next) {
    const { accountNumber } = req.params;
    if (accountNumber.toString().length === 9) {
      next();
      return null;
    }
    return res.status(400).json({
      status: 400,
      error: 'Invalid account number, account number must be 9 digits long'
    });
  },
};

export default url;
