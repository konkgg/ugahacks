import { generateRandomUser } from './mockDataGenerator';
import type { UserState } from '../types';

export async function getInitialState(): Promise<UserState> {
  // Generate the initial user data on the server
  const user = generateRandomUser();
  
  // Ensure all date fields are properly converted to Date objects
  const processedUser = {
    ...user,
    streak: {
      ...user.streak,
      lastLogin: new Date(user.streak.lastLogin),
    },
    transactions: user.transactions.map(t => ({
      ...t,
      timestamp: new Date(t.timestamp),
    })),
    achievements: user.achievements.map(a => ({
      ...a,
      date: new Date(a.date),
    })),
    insightStats: {
      ...user.insightStats,
      lastViewed: new Date(user.insightStats.lastViewed),
    },
    budgetStats: {
      ...user.budgetStats,
      lastUpdated: new Date(user.budgetStats.lastUpdated),
    },
    investmentStats: {
      ...user.investmentStats,
      categories: new Set(Array.from(user.investmentStats.categories)),
      lastUpdated: new Date(user.investmentStats.lastUpdated),
    },
  };

  // Ensure transactions are included in both the user object and the top-level transactions array
  const transactions = processedUser.transactions;

  return {
    user: processedUser,
    transactions, // This should be the same array as processedUser.transactions
    insights: [],
    isAnimating: false,
    isHydrated: true
  };
} 