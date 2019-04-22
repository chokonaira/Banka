import pool from './index';
import tables from './schema';

(async function () {
  console.log('droping all tables...');
  try {
    await pool.query(tables.droptables);

  } catch (error) {
    console.log(error);
  }
  console.log('tables droped successfully');
}());
