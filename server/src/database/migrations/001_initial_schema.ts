import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Users table
  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("email").unique().notNullable();
    table.string("password_hash").notNullable();
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.timestamp("email_verified_at").nullable();
    table.timestamp("last_login_at").nullable();
    table.timestamps(true, true);

    table.index(["email"]);
  });

  // Plaid items table (for storing Plaid connection metadata)
  await knex.schema.createTable("plaid_items", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("item_id").unique().notNullable(); // Plaid item ID
    table.string("access_token").notNullable(); // Encrypted Plaid access token
    table.string("institution_id").notNullable();
    table.string("institution_name").notNullable();
    table.json("available_products").nullable();
    table.json("billed_products").nullable();
    table.timestamp("last_successful_update").nullable();
    table.timestamp("last_failed_update").nullable();
    table.string("error_code").nullable();
    table.text("error_message").nullable();
    table.timestamps(true, true);

    table.index(["user_id"]);
    table.index(["item_id"]);
  });

  // Accounts table
  await knex.schema.createTable("accounts", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .uuid("plaid_item_id")
      .nullable()
      .references("id")
      .inTable("plaid_items")
      .onDelete("SET NULL");
    table.string("plaid_account_id").nullable(); // Plaid account ID
    table.string("name").notNullable();
    table
      .enum("type", ["budgeted", "unbudgeted"])
      .notNullable()
      .defaultTo("budgeted");
    table.decimal("cached_balance", 15, 2).notNullable().defaultTo(0);
    table.string("official_name").nullable();
    table.string("mask").nullable();
    table.string("subtype").nullable();
    table.boolean("is_active").notNullable().defaultTo(true);
    table.timestamps(true, true);

    table.index(["user_id"]);
    table.index(["plaid_item_id"]);
    table.index(["plaid_account_id"]);
  });

  // Budget groups table
  await knex.schema.createTable("budget_groups", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("name").notNullable();
    table.integer("sort_order").notNullable().defaultTo(0);
    table.boolean("is_active").notNullable().defaultTo(true);
    table.timestamps(true, true);

    table.index(["user_id"]);
    table.unique(["user_id", "name"]);
  });

  // Budget categories table
  await knex.schema.createTable("budget_categories", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .uuid("budget_group_id")
      .notNullable()
      .references("id")
      .inTable("budget_groups")
      .onDelete("CASCADE");
    table.string("name").notNullable();
    table.integer("sort_order").notNullable().defaultTo(0);
    table.boolean("is_active").notNullable().defaultTo(true);
    table.timestamps(true, true);

    table.index(["user_id"]);
    table.index(["budget_group_id"]);
    table.unique(["user_id", "name"]);
  });

  // Monthly budgets table
  await knex.schema.createTable("monthly_budgets", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .uuid("budget_category_id")
      .notNullable()
      .references("id")
      .inTable("budget_categories")
      .onDelete("CASCADE");
    table.string("month_code").notNullable(); // Format: YYYY-MM
    table.decimal("budgeted_amount", 15, 2).notNullable().defaultTo(0);
    table.decimal("activity_amount", 15, 2).notNullable().defaultTo(0);
    table.timestamps(true, true);

    table.index(["user_id"]);
    table.index(["budget_category_id"]);
    table.index(["month_code"]);
    table.unique(["user_id", "budget_category_id", "month_code"]);
  });

  // Transactions table
  await knex.schema.createTable("transactions", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .uuid("account_id")
      .notNullable()
      .references("id")
      .inTable("accounts")
      .onDelete("CASCADE");
    table
      .uuid("budget_category_id")
      .nullable()
      .references("id")
      .inTable("budget_categories")
      .onDelete("SET NULL");
    table.string("plaid_transaction_id").nullable(); // Plaid transaction ID
    table.string("external_id").nullable(); // For CSV imports, etc.
    table.string("payee").notNullable();
    table.text("description").nullable();
    table.decimal("amount", 15, 2).notNullable(); // Positive for income, negative for expenses
    table.date("date").notNullable();
    table.string("category_primary").nullable(); // Plaid primary category
    table.string("category_detailed").nullable(); // Plaid detailed category
    table.text("notes").nullable();
    table.boolean("is_pending").notNullable().defaultTo(false);
    table.boolean("is_recurring").notNullable().defaultTo(false);
    table.string("recurring_frequency").nullable(); // monthly, weekly, etc.
    table.timestamp("categorized_at").nullable();
    table.timestamp("reconciled_at").nullable();
    table.timestamps(true, true);

    table.index(["user_id"]);
    table.index(["account_id"]);
    table.index(["budget_category_id"]);
    table.index(["date"]);
    table.index(["plaid_transaction_id"]);
    table.index(["external_id"]);
    table.index(["payee"]);
    table.index(["amount"]);
    table.index(["user_id", "date"]); // Composite index for user transactions by date
  });

  // Import jobs table (for tracking CSV imports)
  await knex.schema.createTable("import_jobs", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("filename").notNullable();
    table.string("status").notNullable().defaultTo("pending"); // pending, processing, completed, failed
    table.integer("total_rows").nullable();
    table.integer("processed_rows").nullable().defaultTo(0);
    table.integer("successful_rows").nullable().defaultTo(0);
    table.integer("failed_rows").nullable().defaultTo(0);
    table.json("errors").nullable();
    table.timestamp("started_at").nullable();
    table.timestamp("completed_at").nullable();
    table.timestamps(true, true);

    table.index(["user_id"]);
    table.index(["status"]);
  });

  // User settings table
  await knex.schema.createTable("user_settings", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("key").notNullable();
    table.text("value").nullable();
    table.timestamps(true, true);

    table.index(["user_id"]);
    table.unique(["user_id", "key"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("user_settings");
  await knex.schema.dropTableIfExists("import_jobs");
  await knex.schema.dropTableIfExists("transactions");
  await knex.schema.dropTableIfExists("monthly_budgets");
  await knex.schema.dropTableIfExists("budget_categories");
  await knex.schema.dropTableIfExists("budget_groups");
  await knex.schema.dropTableIfExists("accounts");
  await knex.schema.dropTableIfExists("plaid_items");
  await knex.schema.dropTableIfExists("users");
}
