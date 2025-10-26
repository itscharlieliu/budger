// User types
export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  email_verified_at?: Date;
  last_login_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, "password_hash">;
  token: string;
}

// Account types
export enum AccountType {
  BUDGETED = "budgeted",
  UNBUDGETED = "unbudgeted",
}

export interface Account {
  id: string;
  user_id: string;
  plaid_item_id?: string;
  plaid_account_id?: string;
  name: string;
  type: AccountType;
  cached_balance: number;
  official_name?: string;
  mask?: string;
  subtype?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateAccountRequest {
  name: string;
  type: AccountType;
  cached_balance?: number;
}

// Transaction types
export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  budget_category_id?: string;
  plaid_transaction_id?: string;
  external_id?: string;
  payee: string;
  description?: string;
  amount: number;
  date: Date;
  category_primary?: string;
  category_detailed?: string;
  notes?: string;
  is_pending: boolean;
  is_recurring: boolean;
  recurring_frequency?: string;
  categorized_at?: Date;
  reconciled_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTransactionRequest {
  account_id: string;
  budget_category_id?: string;
  payee: string;
  description?: string;
  amount: number;
  date: Date;
  notes?: string;
}

export interface UpdateTransactionRequest {
  budget_category_id?: string;
  payee?: string;
  description?: string;
  amount?: number;
  date?: Date;
  notes?: string;
}

// Budget types
export interface BudgetGroup {
  id: string;
  user_id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface BudgetCategory {
  id: string;
  user_id: string;
  budget_group_id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface MonthlyBudget {
  id: string;
  user_id: string;
  budget_category_id: string;
  month_code: string;
  budgeted_amount: number;
  activity_amount: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateBudgetGroupRequest {
  name: string;
  sort_order?: number;
}

export interface CreateBudgetCategoryRequest {
  budget_group_id: string;
  name: string;
  sort_order?: number;
}

export interface CreateMonthlyBudgetRequest {
  budget_category_id: string;
  month_code: string;
  budgeted_amount: number;
}

// Plaid types
export interface PlaidItem {
  id: string;
  user_id: string;
  item_id: string;
  access_token: string;
  institution_id: string;
  institution_name: string;
  available_products?: string[];
  billed_products?: string[];
  last_successful_update?: Date;
  last_failed_update?: Date;
  error_code?: string;
  error_message?: string;
  created_at: Date;
  updated_at: Date;
}

export interface PlaidLinkTokenRequest {
  user_id: string;
}

export interface PlaidExchangeTokenRequest {
  public_token: string;
  institution_id: string;
  institution_name: string;
}

// Import/Export types
export interface ImportJob {
  id: string;
  user_id: string;
  filename: string;
  status: "pending" | "processing" | "completed" | "failed";
  total_rows?: number;
  processed_rows: number;
  successful_rows: number;
  failed_rows: number;
  errors?: any[];
  started_at?: Date;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CSVTransactionRow {
  date: string;
  payee: string;
  amount: string;
  account: string;
  category?: string;
  notes?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// JWT Payload
export interface JWTPayload {
  user_id: string;
  email: string;
  iat: number;
  exp: number;
}

// Request types with user context
export interface AuthenticatedRequest extends Request {
  user?: User;
}
