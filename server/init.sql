-- Initialize database
CREATE DATABASE budger;
CREATE USER budger_user WITH PASSWORD 'budger_password';
GRANT ALL PRIVILEGES ON DATABASE budger TO budger_user;
