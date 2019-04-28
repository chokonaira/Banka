import accountModel from '../models/accountModel';
import transactionModel from '../models/transactionModel';

export default class CashierController {
  static async creditAccount(req, res) {
    try {
      let oldBalance;
      const cashier = req.user.userId;
      const { amount } = req.body;
      const createdOn = new Date();
      const lastTransaction = await transactionModel.getLastTransaction(req);
      if (lastTransaction) {
        oldBalance = lastTransaction.accountbalance;
      } else {
        const bankAccount = await accountModel.getAccount(req, res);
        oldBalance = bankAccount[0].openingbalance;
      }
      const accountBalance = ((+oldBalance) + (+amount)).toFixed(2);
      const data = {
        type: 'credit', amount, cashier, accountBalance, createdOn,
      };
      const newTransaction = await transactionModel.create(req, data);
      if (newTransaction.length) {
        await accountModel.update(req, accountBalance);
        return res.status(200).json({
          status: 200,
          message: 'Account credited successfully',
          data: newTransaction[0],
        });
      }
    } catch (error) {
      return res.status(500).send({
        status: 500,
        error: 'Unable to credit account!! Server Error, Please Try Again',
      });
    }
  }

  static async debitAccount(req, res) {
    try {
      let oldBalance;
      const cashier = req.user.userId;
      const { amount } = req.body;
      const createdOn = new Date();
      const lastTransaction = await transactionModel.getLastTransaction(req);
      if (lastTransaction) {
        oldBalance = lastTransaction.accountbalance;
      } else {
        const bankAccount = await accountModel.getAccount(req, res);
        oldBalance = bankAccount[0].openingbalance;
      }
      if ((+oldBalance) < (+amount)) {
        return res.status(400).json({
          status: 400,
          message: 'Insufficient funds',
        });
      }
      const accountBalance = ((+oldBalance) - (+amount)).toFixed(2);
      const data = {
        type: 'credit', amount, cashier, accountBalance, createdOn,
      };
      const newTransaction = await transactionModel.create(req, data);
      if (newTransaction.length) {
        await accountModel.update(req, accountBalance);
        return res.status(200).json({
          status: 200,
          message: 'Account debited successfully',
          data: newTransaction[0],
        });
      }
      return null;
    } catch (error) {
      return res.status(500).send({
        status: 500,
        error: 'Unable to debit account!! Server Error, Please Try Again',
      });
    }
  }
}
