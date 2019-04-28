import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const databaseUrl = process.env.DATABASE_URL
const pool = new Pool({
  connectionString: databaseUrl,
});

export default pool;