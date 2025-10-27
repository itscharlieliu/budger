# Budger Server

A Node.js Express server with PostgreSQL for the Budger budget application.

## Setup

1. Install dependencies:
```bash
yarn install
```

2. Set up PostgreSQL database:
   - Create a database named `budger`
   - Run the schema.sql file to create tables and sample data:
   ```bash
   # start postgreSQL daemon
   postgres -D /opt/homebrew/var/postgresql@14

   # create database. You only need to do this once
   psql -d budger -f schema.sql
   ```

3. Configure environment variables (optional):
   - Create a `.env` file with your database credentials if needed:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=budger
   DB_USER=charlie
   DB_PASSWORD=
   ```

4. Start the server:
```bash
# Development mode with auto-restart
yarn dev

# Production mode
yarn start
```

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /transactions` - Fetch all transactions with user and account details

## Database Schema

The application uses three main tables:
- **Users**: Store user information
- **Accounts**: Bank accounts linked to users
- **Transactions**: Financial transactions linked to users and accounts

## Sample Data

The schema includes sample data for testing the API endpoints.
