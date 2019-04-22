import pool from './index';
import tables from './schema';

(async function () {
  console.log('creating tables...');
  try {
    console.log('creating users table..');
    await pool.query(tables.usersTable);

    console.log('creating accounts table..');
    await pool.query(tables.accountsTable);

    console.log('creating transactions table..');
    await pool.query(tables.transactionsTable);

  } catch (error) {
    console.log(error);
  }
  console.log('tables created successfully');
}());
