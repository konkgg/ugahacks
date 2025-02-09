import OpenAI from 'openai';
import type { Transaction, AIInsight, Song } from '../types';

if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
  throw new Error('Missing NEXT_PUBLIC_OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateFinancialInsights(transactions: Transaction[], userId: string): Promise<AIInsight> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a financial advisor analyzing transaction data. You must respond with ONLY a JSON object in this exact format:
{
  "summary": "Brief summary of financial status",
  "advice": "Actionable financial advice",
  "spendingAnalysis": {
    "categories": { "category1": amount1, "category2": amount2 },
    "trends": ["trend1", "trend2"],
    "recommendations": ["recommendation1", "recommendation2"]
  },
  "playlist": [  // Must contain between 5-7 songs, inclusive
    {
      "id": "unique-id",
      "title": "Song Title",
      "artist": "Artist Name",
      "mood": "happy/sad/etc",
      "reason": "Why this song matches the financial mood"
    }
  ]
}
Note: The playlist MUST contain between 5 and 7 songs, no more and no less.`
      },
      {
        role: "user",
        content: JSON.stringify({ transactions, userId })
      }
    ],
    temperature: 0.7,
    max_tokens: 1000,
    response_format: { type: "json_object" }
  });

  const content = response.choices[0].message.content || '{}';
  const result = JSON.parse(content);
  
  return {
    id: crypto.randomUUID(),
    userId,
    date: new Date(),
    summary: result.summary || "No insights available.",
    advice: result.advice || "",
    spendingAnalysis: {
      categories: result.spendingAnalysis?.categories || {},
      trends: result.spendingAnalysis?.trends || [],
      recommendations: result.spendingAnalysis?.recommendations || []
    },
    playlist: result.playlist || []
  };
} 