const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /accounts - Get all accounts for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, account_type, balance, created_at, updated_at FROM accounts WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch accounts',
      message: error.message
    });
  }
});

// POST /accounts - Create a new account for the authenticated user
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, account_type, balance = 0.00 } = req.body;

    // Validate required fields
    if (!name || !account_type) {
      return res.status(400).json({
        success: false,
        error: 'Name and account_type are required'
      });
    }

    // Validate account_type
    const validTypes = ['checking', 'savings', 'credit', 'investment', 'loan'];
    if (!validTypes.includes(account_type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid account_type. Must be one of: ' + validTypes.join(', ')
      });
    }

    // Validate balance is a number
    const balanceNum = parseFloat(balance);
    if (isNaN(balanceNum)) {
      return res.status(400).json({
        success: false,
        error: 'Balance must be a valid number'
      });
    }

    // Create account
    const result = await pool.query(
      'INSERT INTO accounts (user_id, name, account_type, balance) VALUES ($1, $2, $3, $4) RETURNING id, name, account_type, balance, created_at, updated_at',
      [req.user.id, name, account_type, balanceNum]
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create account',
      message: error.message
    });
  }
});

// GET /accounts/:id - Get a specific account for the authenticated user
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT id, name, account_type, balance, created_at, updated_at FROM accounts WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Account not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch account',
      message: error.message
    });
  }
});

module.exports = router;
