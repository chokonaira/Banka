/* eslint-disable no-unused-expressions */
/* eslint-disable require-jsdoc */
import pool from '../db';
import auth from '../middleware/auth';


export default class StaffController {
  static async creditAccount(req, res) {
    const user = auth.tokenBearer(req);
    const { userId: cashier } = user;
    const { accountNumber } = req.params;
    const { amount } = req.body;
    const type = 'credit'
    let oldBalance;
    let row;
    if (!user.isAdmin && user.type.toLowerCase() === 'staff') {
      const getAccountQuery = 'SELECT * FROM  accounts WHERE accountNo = $1';
      const getTransactionQuery = 'SELECT * FROM  transactions WHERE createdOn = (SELECT MAX(createdOn) FROM transactions WHERE accountNo = $1)';
      const creditQuery = `INSERT INTO transactions(createdOn, type, accountNo, amount, cashier, accountBalance)  VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`;


      try {
        const { rows } = await pool.query(getTransactionQuery, [accountNumber]);
        row = rows[0];
        if (!row) {
          const { rows } = await pool.query(getAccountQuery, [accountNumber]);
          row = rows[0];
          if (!row) {
            return res.status(404).send({
              status: 404,
              data: 'Account does not exist',
            });
          }
          // postgres convert camel cases to lower case, nolonger openingBalance and accountBalance
          // but openingbalance and accountbalance
          oldBalance = row.openingbalance;
        } else {
          oldBalance = row.accountbalance;
        }
        const accountBalance = ((+oldBalance) + (+amount)).toFixed(2)
        const createdOn = new Date();
        const transaction = [
          createdOn,
          type.trim(),
          accountNumber,
          amount,
          cashier,
          accountBalance,
        ];
        const response = await pool.query(creditQuery, transaction);
        return res.status(200).json({
          status: 200,
          message: `The account ${accountNumber} has been credited with ${amount} on ${createdOn}`,
          data: [response.rows[0]],
        });
      } catch (error) {
        return res.status(500).send({
          status: 500,
          error: 'Unable to credit account!! Server Error, Please Try Again',
        });
      }
    }
    return res.status(409).json({
      status: 409,
      message: 'you must be a staff (Cashier) to perform this task',
    });
  }
  
}
