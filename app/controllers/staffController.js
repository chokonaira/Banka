/* eslint-disable no-unused-expressions */
/* eslint-disable require-jsdoc */
import accountDb from '../db/account';
import transactionDb from '../db/transaction';

export default class StaffController {
  static ActivatOrDeactivateAccct(req, res) {
    const { isAdmin } = req.decoded;
    const { accountNumber } = req.params;

    if (isAdmin !== 'true') {
      return res.status(409).json({
        status: 409,
        message: 'only an admin is allow to perform this task',
      });
    }
    const account = accountDb.find(acct => acct.accountNumber === Number(accountNumber));

    if (!account) {
      return res.status(404).json({
        status: 404,
        message: 'Selected account not found',
      });
    }

    account.status = req.body.status || account.status;
    return res.status(200).json({
      status: 200,
      data: {
        accountNumber,
        status: account.status
      },
    });
  }


  /**
   * deleteAccount()
   * @desc deletes a user account
   * @param {*} req
   * @param {*} res
   * @returns {object} deletedAccount
   */
  static deleteAccount(req, res) {
    const { isAdmin } = req.decoded;
    const { accountNumber } = req.params;
    if (isAdmin !== 'true') {
      return res.status(409).json({
        status: 409,
        message: 'only an admin is allow to perform this task',
      });
    }

    for (let i = 0; i < accountDb.length; i += 1) {
      if (accountDb[i].accountNumber === Number(accountNumber)) {
        accountDb.splice(i, 1);
        return res.status(200).json({
          status: 200,
          message: 'seleted account successfully deleted',
        });
      }
    }
    return res.status(404).json({ message: '404, account not found' });
  }

  
}
