import OpenAI from "openai";
import { logger } from "@/utils/logger";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error("OpenAI API key not configured");
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export interface CategorizationResult {
  category: string;
  confidence: number;
  reasoning?: string;
}

export class CategorizationService {
  /**
   * Categorize a transaction using OpenAI
   */
  static async categorizeTransaction(
    payee: string,
    description: string,
    amount: number,
    existingCategories: string[]
  ): Promise<CategorizationResult> {
    try {
      const prompt = this.buildCategorizationPrompt(
        payee,
        description,
        amount,
        existingCategories
      );

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a financial categorization assistant. Analyze transactions and suggest appropriate budget categories.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 200,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No response from OpenAI");
      }

      return this.parseCategorizationResponse(content, existingCategories);
    } catch (error) {
      logger.error("Error categorizing transaction:", error);
      throw new Error("Failed to categorize transaction");
    }
  }

  /**
   * Build the prompt for transaction categorization
   */
  private static buildCategorizationPrompt(
    payee: string,
    description: string,
    amount: number,
    existingCategories: string[]
  ): string {
    const categoriesList = existingCategories.join(", ");

    return `
Please categorize this transaction:

Payee: ${payee}
Description: ${description}
Amount: $${amount.toFixed(2)}

Available categories: ${categoriesList}

Please respond with:
1. The most appropriate category from the list above
2. A confidence score from 0-100
3. Brief reasoning for your choice

Format your response as:
Category: [category name]
Confidence: [0-100]
Reasoning: [brief explanation]

If no existing category fits well, suggest "Other" and explain why.
    `.trim();
  }

  /**
   * Parse the OpenAI response into structured data
   */
  private static parseCategorizationResponse(
    response: string,
    existingCategories: string[]
  ): CategorizationResult {
    const lines = response.split("\n").map((line) => line.trim());

    let category = "Other";
    let confidence = 50;
    let reasoning = "Unable to parse response";

    for (const line of lines) {
      if (line.startsWith("Category:")) {
        const suggestedCategory = line.replace("Category:", "").trim();
        // Check if the suggested category exists in our list
        const matchedCategory = existingCategories.find(
          (cat) =>
            cat.toLowerCase().includes(suggestedCategory.toLowerCase()) ||
            suggestedCategory.toLowerCase().includes(cat.toLowerCase())
        );
        category = matchedCategory || "Other";
      } else if (line.startsWith("Confidence:")) {
        const confidenceStr = line.replace("Confidence:", "").trim();
        const parsedConfidence = parseInt(confidenceStr);
        if (!isNaN(parsedConfidence)) {
          confidence = Math.max(0, Math.min(100, parsedConfidence));
        }
      } else if (line.startsWith("Reasoning:")) {
        reasoning = line.replace("Reasoning:", "").trim();
      }
    }

    return {
      category,
      confidence,
      reasoning,
    };
  }

  /**
   * Batch categorize multiple transactions
   */
  static async categorizeTransactions(
    transactions: Array<{
      payee: string;
      description: string;
      amount: number;
    }>,
    existingCategories: string[]
  ): Promise<CategorizationResult[]> {
    try {
      const results: CategorizationResult[] = [];

      // Process in batches to avoid rate limits
      const batchSize = 5;
      for (let i = 0; i < transactions.length; i += batchSize) {
        const batch = transactions.slice(i, i + batchSize);

        const batchPromises = batch.map((transaction) =>
          this.categorizeTransaction(
            transaction.payee,
            transaction.description,
            transaction.amount,
            existingCategories
          )
        );

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);

        // Add small delay between batches
        if (i + batchSize < transactions.length) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      return results;
    } catch (error) {
      logger.error("Error batch categorizing transactions:", error);
      throw new Error("Failed to categorize transactions");
    }
  }

  /**
   * Suggest new budget categories based on transaction patterns
   */
  static async suggestNewCategories(
    transactions: Array<{
      payee: string;
      description: string;
      amount: number;
    }>,
    existingCategories: string[]
  ): Promise<string[]> {
    try {
      const prompt = `
Analyze these transactions and suggest new budget categories that would be useful:

Transactions:
${transactions
  .map((t) => `${t.payee} - ${t.description} - $${t.amount.toFixed(2)}`)
  .join("\n")}

Existing categories: ${existingCategories.join(", ")}

Please suggest 3-5 new budget categories that would help organize these transactions better.
Focus on categories that are:
1. Specific enough to be useful
2. Broad enough to group similar transactions
3. Not already covered by existing categories

Format as a simple list, one category per line.
      `.trim();

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a financial planning assistant. Suggest useful budget categories based on transaction patterns.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 300,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return [];
      }

      return content
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && !line.match(/^\d+\./))
        .slice(0, 5); // Limit to 5 suggestions
    } catch (error) {
      logger.error("Error suggesting new categories:", error);
      return [];
    }
  }
}
