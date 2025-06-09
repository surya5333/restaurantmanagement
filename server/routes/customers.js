const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hotelmanag',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Convert callback-based pool to promise-based
const pool = db.promise();

// Get all customers
router.get('/', async (req, res) => {
  try {
    console.log('GET /customers request received');
    const [results] = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
    console.log('Fetched customers:', results);
    res.json(results);
  } catch (err) {
    console.error('Error fetching customers:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      return res.status(500).json({ error: 'Database connection was lost' });
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      return res.status(500).json({ error: 'Database has too many connections' });
    }
    if (err.code === 'ECONNREFUSED') {
      return res.status(500).json({ error: 'Database connection was refused' });
    }
    return res.status(500).json({ error: 'Error fetching customers', details: err.message });
  }
});

// Add new customer
router.post('/', (req, res) => {
  console.log('POST /customers hit');
console.log('Request body:', req.body);

  console.log('POST /customers request received with body:', req.body);
  const { name, email, phone} = req.body;

  if (!name || !email) {
    console.error('Missing required fields');
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const sql = 'INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)';
  db.query(sql, [name, email, phone ], (err, result) => {
    if (err) {
      console.error('Error adding customer:', err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: 'Error adding customer', details: err.message });
    }
    const newCustomer = { id: result.insertId, name, email, phone };
    console.log('Added new customer:', newCustomer);
    res.status(201).json(newCustomer);
  });
});

// Update customer
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone} = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const [result] = await pool.query(
      'UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ?',
      [name, email, phone, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ id: req.params.id, name, email, phone });
  } catch (err) {
    console.error('Error updating customer:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      await pool.query(
        'UPDATE customers SET visits = visits + 1 WHERE id = ?',
        [req.params.id]
      );
      return res.status(409).json({ error: 'Email already exists' });
      

    }
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      return res.status(500).json({ error: 'Database connection was lost' });
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      return res.status(500).json({ error: 'Database has too many connections' });
    }
    if (err.code === 'ECONNREFUSED') {
      return res.status(500).json({ error: 'Database connection was refused' });
    }
    return res.status(500).json({ error: 'Error updating customer', details: err.message });
  }
});

// Delete customer
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM customers WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    console.error('Error deleting customer:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      return res.status(500).json({ error: 'Database connection was lost' });
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      return res.status(500).json({ error: 'Database has too many connections' });
    }
    if (err.code === 'ECONNREFUSED') {
      return res.status(500).json({ error: 'Database connection was refused' });
    }
    return res.status(500).json({ error: 'Error deleting customer', details: err.message });
  }
});

module.exports = router;