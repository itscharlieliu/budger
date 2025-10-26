import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { logger } from "@/utils/logger";

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || "sandbox";

if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
  throw new Error("Plaid credentials not configured");
}

// Configure Plaid client
const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV as keyof typeof PlaidEnvironments],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": PLAID_CLIENT_ID,
      "PLAID-SECRET": PLAID_SECRET,
    },
  },
});

export const plaidClient = new PlaidApi(configuration);

export class PlaidService {
  /**
   * Create a link token for Plaid Link
   */
  static async createLinkToken(userId: string): Promise<string> {
    try {
      const request = {
        user: {
          client_user_id: userId,
        },
        client_name: "Budger",
        products: ["transactions", "auth", "identity"],
        country_codes: ["US"],
        language: "en",
        webhook: `${process.env.API_BASE_URL}/api/v1/plaid/webhook`,
      };

      const response = await plaidClient.linkTokenCreate(request);
      return response.data.link_token;
    } catch (error) {
      logger.error("Error creating link token:", error);
      throw new Error("Failed to create link token");
    }
  }

  /**
   * Exchange public token for access token
   */
  static async exchangePublicToken(publicToken: string): Promise<{
    access_token: string;
    item_id: string;
  }> {
    try {
      const request = {
        public_token: publicToken,
      };

      const response = await plaidClient.itemPublicTokenExchange(request);
      return {
        access_token: response.data.access_token,
        item_id: response.data.item_id,
      };
    } catch (error) {
      logger.error("Error exchanging public token:", error);
      throw new Error("Failed to exchange public token");
    }
  }

  /**
   * Get account information
   */
  static async getAccounts(accessToken: string): Promise<any[]> {
    try {
      const request = {
        access_token: accessToken,
      };

      const response = await plaidClient.accountsGet(request);
      return response.data.accounts;
    } catch (error) {
      logger.error("Error getting accounts:", error);
      throw new Error("Failed to get accounts");
    }
  }

  /**
   * Get transactions for a date range
   */
  static async getTransactions(
    accessToken: string,
    startDate: string,
    endDate: string,
    accountIds?: string[]
  ): Promise<any[]> {
    try {
      const request = {
        access_token: accessToken,
        start_date: startDate,
        end_date: endDate,
        ...(accountIds && { account_ids: accountIds }),
      };

      const response = await plaidClient.transactionsGet(request);
      return response.data.transactions;
    } catch (error) {
      logger.error("Error getting transactions:", error);
      throw new Error("Failed to get transactions");
    }
  }

  /**
   * Get institution information
   */
  static async getInstitution(institutionId: string): Promise<any> {
    try {
      const request = {
        institution_id: institutionId,
        country_codes: ["US"],
      };

      const response = await plaidClient.institutionsGetById(request);
      return response.data.institution;
    } catch (error) {
      logger.error("Error getting institution:", error);
      throw new Error("Failed to get institution");
    }
  }

  /**
   * Remove an item (disconnect account)
   */
  static async removeItem(accessToken: string): Promise<void> {
    try {
      const request = {
        access_token: accessToken,
      };

      await plaidClient.itemRemove(request);
    } catch (error) {
      logger.error("Error removing item:", error);
      throw new Error("Failed to remove item");
    }
  }

  /**
   * Get item status
   */
  static async getItemStatus(accessToken: string): Promise<any> {
    try {
      const request = {
        access_token: accessToken,
      };

      const response = await plaidClient.itemGet(request);
      return response.data.item;
    } catch (error) {
      logger.error("Error getting item status:", error);
      throw new Error("Failed to get item status");
    }
  }

  /**
   * Update webhook URL
   */
  static async updateWebhook(
    accessToken: string,
    webhook: string
  ): Promise<void> {
    try {
      const request = {
        access_token: accessToken,
        webhook,
      };

      await plaidClient.itemWebhookUpdate(request);
    } catch (error) {
      logger.error("Error updating webhook:", error);
      throw new Error("Failed to update webhook");
    }
  }
}
