/* eslint-disable no-unused-expressions */
/* eslint-disable require-jsdoc */
import pool from '../db';
import auth from '../middleware/auth';


export default class StaffController {
  static async ActivatOrDeactivateAccct(req, res) {
    const user = auth.tokenBearer(req);
    const { accountNumber } = req.params;

    if (user.isAdmin && user.type === 'staff') {
      const getAccountQuery = 'SELECT * FROM  accounts WHERE accountNo = $1';
      const editQuery = `UPDATE accounts SET status=$1 WHERE accountNo=$2 
    RETURNING *`;

      const { status } = req.body;
      const statusOptions = ['dormant', 'active'];
      const values = [
        status.trim(),
        accountNumber,
      ];
      try {
        const { rows } = await pool.query(getAccountQuery, [accountNumber]);
        if (!rows[0]) {
          return res.status(404).send({
            status: 404,
            error: 'Account does not exist',
          });
        }

        if (!statusOptions.includes(status)) {
          return res.status(409).json({
            status: 409,
            error: 'Invalid account status field, status should be "dormant" or "active',
          });
        }

        const response = await pool.query(editQuery, values);
        return res.status(200).send({
          status: 200,
          data: response.rows[0],
        });
      } catch (error) {
        return res.status(500).json({
          status: status,
          message: error.message,
        });
      }
    }
    return res.status(401).json({
      status: 401,
      message: 'you must be a staff (Admin) to perform this task',
    });
  }

  static async getAllAccounts(req, res) {
    const user = auth.tokenBearer(req);
    if (user.isAdmin && user.type.toLowerCase() === 'staff') {
      let allAccountsQuery;
      let values = [];
      if (req.query.status) {
        allAccountsQuery = 'SELECT * FROM accounts WHERE status = $1 ORDER BY createdOn DESC';
        values = [req.query.status];
      } else {
        allAccountsQuery = 'SELECT * FROM accounts ORDER BY createdOn DESC';
      }


      try {
        const { rows } = await pool.query(allAccountsQuery, values);
        if (!rows || rows.length === 0) {
          return res.status(404).send({
            status: 404,
            message: 'No account found',
          });
        }

        return res.status(200).send({
          status: 200,
          data: rows,
        });
      } catch (error) {
        return res.status(500).send({
          status: 500,
          error: 'Unable to get all account details!! Server Error, Please Try Again',
        });
      }
    }
    return res.status(401).send({
      status: 401,
      message: 'you must be a staff (Admin) to perform this task',
    });
  }

  static async getUserAccounts(req, res) {
    const user = auth.tokenBearer(req);
    if (user.isAdmin && user.type.toLowerCase() === 'staff') {
      const allAccountsQuery = 'SELECT * FROM accounts WHERE owner = (SELECT user_id FROM users WHERE email = $1)';


      try {
        const { rows } = await pool.query(allAccountsQuery, [req.params.userEmail]);
        if (!rows || rows.length === 0) {
          return res.status(404).json({
            status: 404,
            message: 'No account found for the selected user',
          });
        }

        return res.status(200).send({
          status: 200,
          data: rows,
        });
      } catch (error) {
        return res.status(500).send({
          status: 500,
          error: 'Unable to get all account details!! Server Error, Please Try Again',
        });
      }
    }
    return res.status(401).json({
      status: 401,
      message: 'you must be a staff (Admin) to perform this task',
    });
  }

  static async deleteAccount(req, res) {
    const user = auth.tokenBearer(req);
    if (user.isAdmin) {
      const deleteQuery = 'DELETE FROM accounts WHERE accountNo = $1';


      try {
        const { rowCount } = await pool.query(deleteQuery, [req.params.accountNumber]);
        if (rowCount === 0) {
          return res.status(404).send({
            status: 404,
            data: 'Account does not exist',
          });
        }

        return res.status(204).send({
          status: 204,
          message: 'Seleted account successfully deleted',
        });
      } catch (error) {
        return res.status(500).send({
          status: 500,
          error: 'Account delete not completed!! Server Error, Please Try Again',
          message: error.message,
        });
      }
    }
    return res.status(401).json({
      status: 401,
      message: 'you must be a staff (Admin) to perform this task',
    });
  }

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

  static async debitAccount(req, res) {
    const user = auth.tokenBearer(req);
    const { userId: cashier } = user;
    const { accountNumber } = req.params;
    const { amount } = req.body;
    const type = 'debit'
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

        if (parseInt(oldBalance, 10) < parseInt(amount, 10)) {
          return res.status(409).json({
            status: 409,
            message: 'Insufficient funds',
          });
        }

        const accountBalance = ((+oldBalance) - (+amount)).toFixed(2);
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
          message: `The account ${accountNumber} has been debited of ${amount} on ${createdOn}`,
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
