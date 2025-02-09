import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import type { Transaction } from '../types';

if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
  throw new Error('Missing NEXT_PUBLIC_OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

interface ExtractedData {
  transactions: Transaction[];
  balance: number;
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
}

export async function processImages(files: File[]): Promise<ExtractedData> {
  console.log(`Starting OpenAI vision processing for ${files.length} files`);
  try {
    const base64Images = await Promise.all(files.map(fileToBase64));
    console.log('All images converted successfully');

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a financial data extraction expert. Analyze the bank statement images and respond with ONLY a JSON object in this exact format:
{
  "transactions": [
    {
      "date": "YYYY-MM-DD",
      "amount": number,
      "type": "credit" | "debit",
      "description": "string",
      "category": "string"
    }
  ],
  "balance": number
}`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract the financial data from these bank statement images. Respond with ONLY the JSON object, no other text."
            } as const,
            ...base64Images.map(base64 => ({
              type: "image_url" as const,
              image_url: {
                url: `data:image/jpeg;base64,${base64}`,
                detail: "high" as const
              }
            }))
          ]
        }
      ],
      max_tokens: 4096,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    const parsedData = JSON.parse(content);
    return {
      transactions: parsedData.transactions.map((t: any) => ({
        id: uuidv4(),
        userId: '1', // This should be replaced with actual user ID
        amount: t.amount,
        type: t.type,
        category: t.category,
        timestamp: new Date(t.date),
        description: t.description
      })),
      balance: parsedData.balance || 0
    };

  } catch (error) {
    console.error('Failed to process images:', error);
    throw new Error(`Failed to process images: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
} 