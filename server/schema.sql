-- Database schema for Budger application

-- Create database (run this manually)
-- CREATE DATABASE budger;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Accounts table (bank accounts)
CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) NOT NULL, -- 'checking', 'savings', 'credit', etc.
    balance DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    transaction_type VARCHAR(20) NOT NULL, -- 'income', 'expense', 'transfer'
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data for testing. TODO Remove
INSERT INTO users (email, name) VALUES 
    ('john@example.com', 'John Doe'),
    ('jane@example.com', 'Jane Smith')
ON CONFLICT (email) DO NOTHING;

INSERT INTO accounts (user_id, name, account_type, balance) VALUES 
    (1, 'Main Checking', 'checking', 2500.00),
    (1, 'Savings Account', 'savings', 10000.00),
    (2, 'Credit Card', 'credit', -500.00)
ON CONFLICT DO NOTHING;

INSERT INTO transactions (user_id, account_id, amount, description, category, transaction_type, transaction_date) VALUES 
    (1, 1, -50.00, 'Grocery shopping', 'Food', 'expense', '2024-01-15'),
    (1, 1, 3000.00, 'Salary deposit', 'Income', 'income', '2024-01-01'),
    (1, 2, 500.00, 'Transfer to savings', 'Savings', 'transfer', '2024-01-10'),
    (2, 3, -25.00, 'Coffee shop', 'Food', 'expense', '2024-01-14'),
    (1, 1, -120.00, 'Electric bill', 'Utilities', 'expense', '2024-01-12')
ON CONFLICT DO NOTHING;
