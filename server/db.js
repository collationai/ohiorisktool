import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 20,
});

// Test the connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Query helper function
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Get a client from the pool
export const getClient = async () => {
  const client = await pool.connect();
  const query = client.query;
  const release = client.release;

  // Monkey patch the query method to keep track of the last query
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
  }, 5000);

  client.query = (...args) => {
    return query.apply(client, args);
  };

  client.release = () => {
    clearTimeout(timeout);
    client.query = query;
    client.release = release;
    return release.apply(client);
  };

  return client;
};

// Test database connection
export const testConnection = async () => {
  try {
    const result = await query('SELECT NOW()');
    console.log('Database connection test successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error.message);
    return false;
  }
};

// Get all tables in the database
export const getTables = async (schema = 'collation_storage') => {
  try {
    const result = await query(`
      SELECT table_name, table_schema
      FROM information_schema.tables
      WHERE table_schema = $1
      ORDER BY table_name;
    `, [schema]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching tables:', error);
    throw error;
  }
};

export default pool;
