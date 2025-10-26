import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("user_settings").del();
  await knex("import_jobs").del();
  await knex("transactions").del();
  await knex("monthly_budgets").del();
  await knex("budget_categories").del();
  await knex("budget_groups").del();
  await knex("accounts").del();
  await knex("plaid_items").del();
  await knex("users").del();

  // Insert sample users
  const [user1] = await knex("users")
    .insert([
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        email: "demo@budger.com",
        password_hash:
          "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/9KzKz2C", // password: demo123
        first_name: "Demo",
        last_name: "User",
        email_verified_at: new Date(),
      },
    ])
    .returning("*");

  // Insert sample budget groups
  const budgetGroups = await knex("budget_groups")
    .insert([
      {
        id: "550e8400-e29b-41d4-a716-446655440010",
        user_id: user1.id,
        name: "Essential Expenses",
        sort_order: 1,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440011",
        user_id: user1.id,
        name: "Savings & Investments",
        sort_order: 2,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440012",
        user_id: user1.id,
        name: "Lifestyle",
        sort_order: 3,
      },
    ])
    .returning("*");

  // Insert sample budget categories
  const budgetCategories = await knex("budget_categories")
    .insert([
      // Essential Expenses
      {
        id: "550e8400-e29b-41d4-a716-446655440020",
        user_id: user1.id,
        budget_group_id: budgetGroups[0].id,
        name: "Housing",
        sort_order: 1,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440021",
        user_id: user1.id,
        budget_group_id: budgetGroups[0].id,
        name: "Groceries",
        sort_order: 2,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440022",
        user_id: user1.id,
        budget_group_id: budgetGroups[0].id,
        name: "Transportation",
        sort_order: 3,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440023",
        user_id: user1.id,
        budget_group_id: budgetGroups[0].id,
        name: "Utilities",
        sort_order: 4,
      },
      // Savings & Investments
      {
        id: "550e8400-e29b-41d4-a716-446655440024",
        user_id: user1.id,
        budget_group_id: budgetGroups[1].id,
        name: "Emergency Fund",
        sort_order: 1,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440025",
        user_id: user1.id,
        budget_group_id: budgetGroups[1].id,
        name: "Retirement",
        sort_order: 2,
      },
      // Lifestyle
      {
        id: "550e8400-e29b-41d4-a716-446655440026",
        user_id: user1.id,
        budget_group_id: budgetGroups[2].id,
        name: "Entertainment",
        sort_order: 1,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440027",
        user_id: user1.id,
        budget_group_id: budgetGroups[2].id,
        name: "Dining Out",
        sort_order: 2,
      },
    ])
    .returning("*");

  // Insert sample accounts
  const accounts = await knex("accounts")
    .insert([
      {
        id: "550e8400-e29b-41d4-a716-446655440030",
        user_id: user1.id,
        name: "Checking Account",
        type: "budgeted",
        cached_balance: 2500.0,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440031",
        user_id: user1.id,
        name: "Savings Account",
        type: "budgeted",
        cached_balance: 10000.0,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440032",
        user_id: user1.id,
        name: "Credit Card",
        type: "budgeted",
        cached_balance: -500.0,
      },
    ])
    .returning("*");

  // Insert sample monthly budgets (current month)
  const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
  await knex("monthly_budgets").insert([
    {
      user_id: user1.id,
      budget_category_id: budgetCategories[0].id, // Housing
      month_code: currentMonth,
      budgeted_amount: 1200.0,
      activity_amount: -1150.0,
    },
    {
      user_id: user1.id,
      budget_category_id: budgetCategories[1].id, // Groceries
      month_code: currentMonth,
      budgeted_amount: 400.0,
      activity_amount: -350.0,
    },
    {
      user_id: user1.id,
      budget_category_id: budgetCategories[2].id, // Transportation
      month_code: currentMonth,
      budgeted_amount: 200.0,
      activity_amount: -180.0,
    },
    {
      user_id: user1.id,
      budget_category_id: budgetCategories[3].id, // Utilities
      month_code: currentMonth,
      budgeted_amount: 150.0,
      activity_amount: -145.0,
    },
    {
      user_id: user1.id,
      budget_category_id: budgetCategories[4].id, // Emergency Fund
      month_code: currentMonth,
      budgeted_amount: 500.0,
      activity_amount: 500.0,
    },
    {
      user_id: user1.id,
      budget_category_id: budgetCategories[5].id, // Retirement
      month_code: currentMonth,
      budgeted_amount: 300.0,
      activity_amount: 300.0,
    },
    {
      user_id: user1.id,
      budget_category_id: budgetCategories[6].id, // Entertainment
      month_code: currentMonth,
      budgeted_amount: 100.0,
      activity_amount: -75.0,
    },
    {
      user_id: user1.id,
      budget_category_id: budgetCategories[7].id, // Dining Out
      month_code: currentMonth,
      budgeted_amount: 200.0,
      activity_amount: -150.0,
    },
  ]);

  // Insert sample transactions
  const transactions = [
    {
      user_id: user1.id,
      account_id: accounts[0].id, // Checking Account
      budget_category_id: budgetCategories[0].id, // Housing
      payee: "Rent Payment",
      description: "Monthly rent",
      amount: -1150.0,
      date: new Date(),
    },
    {
      user_id: user1.id,
      account_id: accounts[0].id, // Checking Account
      budget_category_id: budgetCategories[1].id, // Groceries
      payee: "Whole Foods",
      description: "Grocery shopping",
      amount: -85.5,
      date: new Date(),
    },
    {
      user_id: user1.id,
      account_id: accounts[0].id, // Checking Account
      budget_category_id: budgetCategories[2].id, // Transportation
      payee: "Shell Gas Station",
      description: "Gas fill-up",
      amount: -45.0,
      date: new Date(),
    },
    {
      user_id: user1.id,
      account_id: accounts[0].id, // Checking Account
      budget_category_id: budgetCategories[4].id, // Emergency Fund
      payee: "Transfer to Savings",
      description: "Monthly savings transfer",
      amount: 500.0,
      date: new Date(),
    },
    {
      user_id: user1.id,
      account_id: accounts[0].id, // Checking Account
      budget_category_id: budgetCategories[7].id, // Dining Out
      payee: "Starbucks",
      description: "Coffee and pastry",
      amount: -12.5,
      date: new Date(),
    },
  ];

  await knex("transactions").insert(transactions);

  console.log("Sample data seeded successfully!");
}
