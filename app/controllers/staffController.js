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

  static creditAccount(req, res) {
    const { firstname, type: usertype } = req.decoded;
    const { accountNumber } = req.params;
    const createdOn = new Date();
    const { type, amount } = req.body;
    let oldBalance;
    let transaction;

    if (usertype.toLowerCase() !== 'staff') {
      return res.status(409).json({
        status: 409,
        message: 'you must be a staff to perform this task',
      });
    }

    const acctExist = accountDb
      .find(account => account.accountNumber.toString() === accountNumber.toString());

    if (!acctExist) {
      return res.status(404).json({
        status: 404,
        message: 'Account not found',
      });
    }

    const transactionExist = transactionDb
      .find(trans => trans.accountNumber.toString() === accountNumber.toString());

    if (!transactionExist) {
      const { openingBalance } = acctExist;
      oldBalance = openingBalance;
      transaction = {
        createdOn,
        type,
        amount,
        accountNumber,
        cashier: firstname,
        oldBalance,
        newBalance: (+oldBalance) + (+amount),
      };
      transactionDb.push(transaction);

      return res.status(201).json({
        status: 201,
        message: `your account ${accountNumber} has been credited with ${amount} on ${createdOn}`,
        data: transaction,
      });
    }
    oldBalance = transactionExist.newBalance;
    const newBalance = (+oldBalance) + (+amount);
    transaction = { ...transactionExist, oldBalance, newBalance };
    transactionDb.forEach((trans, index, object) => {
      if (trans.accountNumber.toString() === accountNumber.toString()) {
        object.splice(index, 1);
      }
    });
    transactionDb.push(transaction);
    return res.status(201).json({
      status: 201,
      message: `your account ${accountNumber} has been credited with ${amount} on ${createdOn}`,
      data: transaction,
    });
  }

  
}
