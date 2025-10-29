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

// POST /transactions - Create a new transaction for the authenticated user
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { account, payee, date, category, note, activity } = req.body;

    // Validate required fields
    if (!account || !payee || !date) {
      return res.status(400).json({
        success: false,
        error: 'Account, payee, and date are required'
      });
    }

    // Look up account_id from account name
    const accountResult = await pool.query(
      'SELECT id FROM accounts WHERE name = $1 AND user_id = $2',
      [account, req.user.id]
    );

    if (accountResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Account not found'
      });
    }

    const accountId = accountResult.rows[0].id;

    // Determine transaction_type and amount from activity
    // activity is in cents (positive for income, negative for expense)
    const amount = Math.abs(activity) / 100; // Convert cents to dollars
    let transactionType = 'expense';
    if (activity > 0) {
      transactionType = 'income';
    } else if (activity === 0) {
      transactionType = 'transfer';
    }

    // Parse date
    const transactionDate = new Date(date);

    // Combine payee and note for description
    let description = payee;
    if (note && note.trim() !== '' && note !== payee) {
      description = `${payee} - ${note}`;
    }

    // Create transaction
    const result = await pool.query(
      `INSERT INTO transactions (user_id, account_id, amount, description, category, transaction_type, transaction_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, amount, description, category, transaction_type, transaction_date, created_at, updated_at`,
      [req.user.id, accountId, amount, description, category || null, transactionType, transactionDate]
    );

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create transaction',
      message: error.message
    });
  }
});

// DELETE /transactions/:id - Delete a transaction for the authenticated user
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // First check if transaction exists and belongs to user
    const checkResult = await pool.query(
      'SELECT id FROM transactions WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    // Delete transaction
    await pool.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete transaction',
      message: error.message
    });
  }
});

module.exports = router;
