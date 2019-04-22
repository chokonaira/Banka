import pool from './index';
import tables from './schema';

(async function () {
    console.log('seeding database with dummy data...');
    try {
        await pool.query(tables.seed);
    } catch (error) {
        console.log(error);
    }
    console.log('seeding completed');
}());
