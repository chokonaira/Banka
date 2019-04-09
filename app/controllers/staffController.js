/* eslint-disable no-unused-expressions */
/* eslint-disable require-jsdoc */
import accountDb from '../db/account';
import transactionDb from '../db/transaction';

export default class StaffController {
  

  static creditAccount(req, res) {
    const { firstname, type: usertype } = req.decoded;
    const { accountNumber } = req.params;
    const createdOn = new Date();
    const { type, amount } = req.body;

    if (!type || !amount) {
      return res.status(400).json({
        status: 400,
        message: 'Validation error, All fields are required',
      });
    }

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
    transaction = {
      ...transactionExist, oldBalance, newBalance, type,
    };
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

  static debitAccount(req, res) {
    const { firstname, type: usertype } = req.decoded;
    const { accountNumber } = req.params;
    const createdOn = new Date();
    const { type, amount } = req.body;

    if (!type || !amount) {
      return res.status(400).json({
        status: 400,
        message: 'Validation error, All fields are required',
      });
    }

    let oldBalance = '';
    let newBalance = '';
    let transaction = {};

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

      if (oldBalance < amount) {
        return res.status(409).json({
          status: 409,
          message: 'Insufficient funds',
        });
      }

      transaction = {
        createdOn,
        type,
        amount,
        accountNumber: parseInt(accountNumber, 10),
        cashier: firstname,
        oldBalance,
        newBalance: (+oldBalance) - (+amount),
      };
      transactionDb.push(transaction);

      return res.status(201).json({
        status: 201,
        message: `your account ${accountNumber} has been debited with ${amount} on ${createdOn}`,
        data: transaction,
      });
    }
    oldBalance = transactionExist.newBalance;

    if (oldBalance < amount) {
      return res.status(409).json({
        status: 409,
        message: 'Insufficient funds',
      });
    }

    newBalance = (+oldBalance) - (+amount);
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
