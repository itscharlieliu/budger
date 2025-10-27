const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /transactions - Fetch all transactions for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT 
        t.id,
        t.amount,
        t.description,
        t.category,
        t.transaction_type,
        t.transaction_date,
        t.created_at,
        t.updated_at,
        u.name as user_name,
        u.email as user_email,
        a.name as account_name,
        a.account_type
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      JOIN accounts a ON t.account_id = a.id
      WHERE t.user_id = $1
      ORDER BY t.transaction_date DESC, t.created_at DESC
    `;
    
    const result = await pool.query(query, [req.user.id]);
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions',
      message: error.message
    });
  }
});

module.exports = router;
