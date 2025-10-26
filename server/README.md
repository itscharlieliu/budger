# Budger Server

Backend server for the Budger budgeting application.

## Features

- **Multi-user support** with JWT authentication
- **Plaid integration** for automatic transaction fetching
- **OpenAI integration** for automatic transaction categorization
- **CSV import/export** with deduplication
- **Daily automated jobs** for transaction imports
- **RESTful API** for client communication
- **PostgreSQL database** with proper indexing for performance

## Prerequisites

- Node.js 18+
- PostgreSQL 13+
- Plaid API credentials
- OpenAI API key

## Installation

1. Install dependencies:
```bash
yarn install
```

2. Set up environment variables:
```bash
cp env.example .env
# Edit .env with your configuration
```

3. Set up the database:
```bash
# Create database
createdb budger

# Run migrations
yarn db:migrate

# Seed with sample data (optional)
yarn db:seed
```

4. Start the development server:
```bash
yarn dev
```

### Optional: use docker
Option 1: Local Development (Current)

```
# Install PostgreSQL locally
brew install postgresql
createdb budger

# Run server locally
yarn dev
```
Option 2: Docker Development
```
# Everything in containers
docker-compose up
```
Option 3: Hybrid
```
# Database in Docker, server locally
docker-compose up postgres
yarn dev
```


## Environment Variables

See `env.example` for required environment variables:

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` - Database configuration
- `JWT_SECRET` - Secret key for JWT tokens
- `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV` - Plaid API credentials
- `OPENAI_API_KEY` - OpenAI API key for categorization
- `CORS_ORIGIN` - Allowed CORS origin (default: http://localhost:3000)

## API Documentation

The server provides RESTful endpoints for:

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile

### Users
- `GET /api/v1/users/stats` - Get user statistics
- `GET /api/v1/users/dashboard` - Get dashboard data

### Accounts
- `GET /api/v1/accounts` - Get all accounts
- `GET /api/v1/accounts/:id` - Get specific account
- `POST /api/v1/accounts` - Create new account
- `PUT /api/v1/accounts/:id` - Update account
- `DELETE /api/v1/accounts/:id` - Delete account
- `PATCH /api/v1/accounts/:id/balance` - Update account balance

### Transactions
- `GET /api/v1/transactions` - Get transactions (with pagination and filtering)
- `GET /api/v1/transactions/:id` - Get specific transaction
- `POST /api/v1/transactions` - Create new transaction
- `PUT /api/v1/transactions/:id` - Update transaction
- `DELETE /api/v1/transactions/:id` - Delete transaction
- `POST /api/v1/transactions/categorize` - Categorize transactions using AI

### Budget
- `GET /api/v1/budget/groups` - Get budget groups
- `POST /api/v1/budget/groups` - Create budget group
- `GET /api/v1/budget/categories` - Get budget categories
- `POST /api/v1/budget/categories` - Create budget category
- `GET /api/v1/budget/monthly` - Get monthly budgets
- `POST /api/v1/budget/monthly` - Create monthly budget

### Plaid Integration
- `POST /api/v1/plaid/link-token` - Create Plaid link token
- `POST /api/v1/plaid/exchange-token` - Exchange public token
- `GET /api/v1/plaid/items` - Get Plaid items
- `POST /api/v1/plaid/items/:id/sync` - Sync transactions
- `DELETE /api/v1/plaid/items/:id` - Remove Plaid item
- `POST /api/v1/plaid/webhook` - Plaid webhook endpoint

### Import/Export
- `POST /api/v1/import/csv` - Import CSV file
- `GET /api/v1/import/jobs/:id` - Get import job status
- `GET /api/v1/import/jobs` - Get all import jobs
- `GET /api/v1/export/transactions` - Export transactions
- `GET /api/v1/export/budget` - Export budget data

## Database Schema

The server uses PostgreSQL with the following main tables:

- `users` - User accounts and authentication
- `accounts` - Bank accounts connected via Plaid
- `transactions` - Financial transactions
- `budget_categories` - Budget categories and groups
- `monthly_budgets` - Monthly budget allocations
- `plaid_items` - Plaid connection metadata
- `import_jobs` - CSV import tracking
- `user_settings` - User preferences

## Automated Jobs

The server runs several automated jobs:

- **Daily Transaction Sync** (2 AM) - Syncs transactions from all Plaid items
- **Daily Categorization** (3 AM) - Categorizes uncategorized transactions using AI
- **Weekly Cleanup** (Sunday 4 AM) - Cleans up old data and error logs

## Development

- `yarn dev` - Start development server with hot reload
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn test` - Run tests
- `yarn lint` - Lint code
- `yarn lint:fix` - Fix linting issues
- `yarn db:migrate` - Run database migrations
- `yarn db:rollback` - Rollback last migration
- `yarn db:seed` - Seed database with sample data
- `yarn db:reset` - Reset database (rollback all, migrate, seed)

## Production Deployment

1. Build the application:
```bash
yarn build
```

2. Set production environment variables

3. Run database migrations:
```bash
yarn db:migrate
```

4. Start the server:
```bash
yarn start
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation with Joi
- SQL injection protection with Knex

## Performance Features

- Database connection pooling
- Proper indexing for fast queries
- Compression middleware
- Efficient pagination
- Background job processing

## License

MIT