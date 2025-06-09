const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hotelmanag'
});

// Get all payments
router.get('/', (req, res) => {
  const sql = `
    SELECT p.*, c.name as customer_name 
    FROM payments p 
    LEFT JOIN customers c ON p.customer_id = c.id 
    ORDER BY payment_date DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching payments:', err);
      return res.status(500).json({ error: 'Error fetching payments' });
    }
    res.json(results);
  });
});

// Add new payment
router.post('/', (req, res) => {
  const { customer_id, amount, payment_method, status, order_id, items } = req.body;
  const sql = 'INSERT INTO payments (customer_id, amount, payment_method, status, order_id, items) VALUES (?, ?, ?, ?, ?, ?)';
  
  db.query(sql, [customer_id, amount, payment_method, status, order_id, items], (err, result) => {
    if (err) {
      console.error('Error adding payment:', err);
      return res.status(500).json({ error: 'Error adding payment' });
    }
    
    // Update customer's visit count and last visit date
    if (customer_id) {
      const updateCustomerSql = 'UPDATE customers SET visits = visits + 1, last_visit = CURRENT_DATE WHERE id = ?';
      db.query(updateCustomerSql, [customer_id], (updateErr) => {
        if (updateErr) {
          console.error('Error updating customer visit info:', updateErr);
        }
      });
    }

    res.status(201).json({ 
      id: result.insertId, 
      customer_id, 
      amount, 
      payment_method, 
      status, 
      order_id, 
      items 
    });
  });
});

// Update payment
router.put('/:id', (req, res) => {
  const { customer_id, amount, payment_method, status, order_id, items } = req.body;
  const sql = 'UPDATE payments SET customer_id = ?, amount = ?, payment_method = ?, status = ?, items = ? WHERE id = ?';
  db.query(sql, [customer_id, amount, payment_method, status, items, req.params.id], (err, result) => {
    if (err) {
      console.error('Error updating payment:', err);
      return res.status(500).json({ error: 'Error updating payment' });
    }
    res.json({ id: req.params.id, ...req.body });
  });
});

// Delete payment
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM payments WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error('Error deleting payment:', err);
      return res.status(500).json({ error: 'Error deleting payment' });
    }
    res.json({ message: 'Payment deleted successfully' });
  });
});


// Get payment statistics
router.get('/stats', (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) as total_transactions,
      SUM(amount) as total_revenue,
      AVG(amount) as average_transaction
    FROM payments
    WHERE status = 'Completed'
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching payment stats:', err);
      return res.status(500).json({ error: 'Error fetching payment statistics' });
    }
    res.json(results[0]);
  });
});

module.exports = router;