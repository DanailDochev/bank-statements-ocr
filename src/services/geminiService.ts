import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY;

export interface Transaction {
  date: string;
  description: string;
  amount: number;
  category: string;
  notes: string;
}

const transactionSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      date: {
        type: Type.STRING,
        description: "The date of the transaction in YYYY-MM-DD format.",
      },
      description: {
        type: Type.STRING,
        description: "A clean description of the transaction.",
      },
      amount: {
        type: Type.NUMBER,
        description: "The transaction amount. Positive for deposits/credits, negative for expenses/debits.",
      },
      category: {
        type: Type.STRING,
        description: "Auto-detected category (e.g., Groceries, Dining, Transport, Salary, Bills, Entertainment, Health, etc.).",
      },
      notes: {
        type: Type.STRING,
        description: "Any additional notes or details about the transaction.",
      },
    },
    required: ["date", "description", "amount", "category"],
  },
};

export interface FileData {
  base64: string;
  mimeType: string;
}

export async function extractTransactions(files: FileData[]): Promise<Transaction[]> {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const model = "gemini-2.0-flash"; 

  const prompt = `Extract all transactions from the provided bank statement files. 
  Follow these rules strictly:
  1. Date format must be YYYY-MM-DD.
  2. Amount must be a number: positive for deposits/income, negative for expenses/withdrawals.
  3. Categorize each transaction into standard categories (Groceries, Dining, Transport, Salary, Bills, etc.).
  4. Skip headers, totals, summary sections, and non-transaction rows.
  5. Extract from all provided files/pages.
  6. Ensure the description is clean and concise.`;

  const fileParts = files.map(file => ({
    inlineData: {
      mimeType: file.mimeType,
      data: file.base64,
    },
  }));

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            ...fileParts
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: transactionSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI model.");
    }

    return JSON.parse(text) as Transaction[];
  } catch (error) {
    console.error("Extraction error:", error);
    throw error;
  }
}
