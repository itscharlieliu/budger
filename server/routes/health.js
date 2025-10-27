const express = require('express');

const router = express.Router();

// GET /health - Health check endpoint
router.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'budger-server'
  });
});

module.exports = router;
