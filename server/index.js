import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query, testConnection, getTables } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API server is running' });
});

// Test database connection endpoint
app.get('/api/db/test', async (req, res) => {
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      res.json({ status: 'success', message: 'Database connection successful' });
    } else {
      res.status(500).json({ status: 'error', message: 'Database connection failed' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Get all tables in the database
app.get('/api/db/tables', async (req, res) => {
  try {
    const { schema = 'collation_storage' } = req.query;
    const tables = await getTables(schema);
    res.json({ status: 'success', tables, schema });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Get table schema
app.get('/api/db/tables/:tableName/schema', async (req, res) => {
  try {
    const { tableName } = req.params;
    const { schema = 'collation_storage' } = req.query;
    const result = await query(`
      SELECT
        column_name,
        data_type,
        character_maximum_length,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_schema = $1
        AND table_name = $2
      ORDER BY ordinal_position;
    `, [schema, tableName]);

    res.json({ status: 'success', schema: result.rows });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Get data from a specific table
app.get('/api/db/tables/:tableName/data', async (req, res) => {
  try {
    const { tableName } = req.params;
    const { limit = 100, offset = 0, schema = 'collation_storage' } = req.query;

    // Validate table name to prevent SQL injection
    const tableCheck = await query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = $1 AND table_name = $2
    `, [schema, tableName]);

    if (tableCheck.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Table not found' });
    }

    // Get total count
    const countResult = await query(`SELECT COUNT(*) FROM "${schema}"."${tableName}"`);
    const total = parseInt(countResult.rows[0].count);

    // Get data
    const result = await query(
      `SELECT * FROM "${schema}"."${tableName}" LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json({
      status: 'success',
      data: result.rows,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Execute custom query (be careful with this in production)
app.post('/api/db/query', async (req, res) => {
  try {
    const { sql, params = [] } = req.body;

    // Only allow SELECT queries for safety
    if (!sql.trim().toLowerCase().startsWith('select')) {
      return res.status(400).json({
        status: 'error',
        message: 'Only SELECT queries are allowed'
      });
    }

    const result = await query(sql, params);
    res.json({ status: 'success', data: result.rows, rowCount: result.rowCount });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`Database host: ${process.env.DB_HOST}`);
  console.log(`Database name: ${process.env.DB_NAME}`);

  // Test database connection on startup
  testConnection().then(isConnected => {
    if (isConnected) {
      console.log('Initial database connection test passed');
    } else {
      console.error('Initial database connection test failed');
    }
  });
});
