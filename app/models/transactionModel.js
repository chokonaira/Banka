import pool from '../db';

export default class TransactionModel {
  static async create(req, data) {
    const { accountNumber } = req.params;
    const {
      type, cashier, accountBalance, amount, createdOn,
    } = data;
    const createQuery = `INSERT INTO transactions(createdOn, type, accountNo, amount, cashier, accountBalance)  VALUES ($1, $2, $3, $4, $5, $6) 
                                RETURNING *`;
    const values = [createdOn, type, accountNumber, amount, cashier, accountBalance];
    try {
      const { rows } = await pool.query(createQuery, values);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getAllTransactions(req, res) {
    const query = 'SELECT * FROM transactions WHERE accountNo = $1';
    const values = [req.params.accountNumber];
    try {
      const { rows } = await pool.query(query, values);
      if (rows.length === 0) {
        return res.status(200).send({
          status: 204,
          data: [],
        });
      }
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getOneTransaction(req, res) {
    const query = 'SELECT * FROM transactions WHERE transaction_id = $1';
    const values = [req.params.transactionId];
    try {
      const { rows } = await pool.query(query, values);
      if (rows.length === 0) {
        return res.status(200).send({
          status: 204,
          data: [],
        });
      }
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getLastTransaction(req) {
    const getTransactionQuery = 'SELECT * FROM  transactions WHERE createdOn = (SELECT MAX(createdOn) FROM transactions WHERE accountNo = $1)';
    const values = [req.params.accountNumber];
    try {
      const { rows } = await pool.query(getTransactionQuery, values);
      if (!rows[0]) {
        return false;
      }
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}
