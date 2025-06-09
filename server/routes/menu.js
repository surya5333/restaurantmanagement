const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hotelmanag'
});

// Get all menu items
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM menu_items ORDER BY category, name';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching menu items:', err);
      return res.status(500).json({ error: 'Error fetching menu items' });
    }
    res.json(results);
  });
});

// Add new menu item
router.post('/', (req, res) => {
  const { name, category, price, description, image_url } = req.body;
  const sql = 'INSERT INTO menu_items (name, category, price, description, image_url) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, category, price, description, image_url], (err, result) => {
    if (err) {
      console.error('Error adding menu item:', err);
      return res.status(500).json({ error: 'Error adding menu item' });
    }
    res.status(201).json({ 
      id: result.insertId, 
      name, 
      category, 
      price, 
      description, 
      image_url 
    });
  });
});

// Update menu item
router.put('/:id', (req, res) => {
  const { name, category, price, description, image_url } = req.body;
  const sql = 'UPDATE menu_items SET name = ?, category = ?, price = ?, description = ?, image_url = ? WHERE id = ?';
  db.query(sql, [name, category, price, description, image_url, req.params.id], (err, result) => {
    if (err) {
      console.error('Error updating menu item:', err);
      return res.status(500).json({ error: 'Error updating menu item' });
    }
    res.json({ 
      id: req.params.id, 
      name, 
      category, 
      price, 
      description, 
      image_url 
    });
  });
});

// Delete menu item
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM menu_items WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error('Error deleting menu item:', err);
      return res.status(500).json({ error: 'Error deleting menu item' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  });
});

module.exports = router;