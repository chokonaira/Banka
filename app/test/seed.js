import pool from '../db/index';
import tables from '../db/schema';

(async function () {
    console.log('seeding test database with dummy data...');
    try {
        await pool.query(tables.testseeds);
    } catch (error) {
        console.log(error);
    }
    console.log('seeding completed');
}());