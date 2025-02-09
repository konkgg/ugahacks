import { User, Transaction } from '../types';
import { v4 as uuidv4 } from 'uuid';

const categories = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Refund', 'Business'],
  expense: [
    'Housing', 'Utilities', 'Groceries', 'Transportation', 'Entertainment',
    'Shopping', 'Health', 'Education', 'Dining', 'Fitness', 'Pet Care'
  ]
};

const locations = {
  Shopping: ['Amazon', 'Target', 'Walmart', 'Best Buy', 'Urban Outfitters'],
  Dining: ['La Cucina', 'Sushi Bar', 'Burger Joint', 'Thai Palace', 'Coffee Shop'],
  Groceries: ['Whole Foods', 'Trader Joe\'s', 'Kroger', 'Publix', 'Safeway'],
  Entertainment: ['Cinema', 'Theme Park', 'Concert Hall', 'Arcade', 'Theater']
};

const tags = {
  Shopping: ['electronics', 'gadgets', 'fashion', 'apparel', 'home'],
  Health: ['wellness', 'fitness', 'healthcare', 'pharmacy'],
  Education: ['learning', 'development', 'books', 'courses'],
  Entertainment: ['movies', 'music', 'games', 'streaming'],
  Fitness: ['gym', 'sports', 'wellness', 'health'],
  Business: ['consulting', 'freelance', 'project', 'services']
};

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomAmount(min: number, max: number): number {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomTags(category: string): string[] {
  const categoryTags = tags[category as keyof typeof tags];
  if (!categoryTags) return [];
  
  const numTags = Math.floor(Math.random() * 3) + 1; // 1-3 tags
  const selectedTags: string[] = [];
  
  for (let i = 0; i < numTags; i++) {
    const tag = getRandomElement(categoryTags);
    if (!selectedTags.includes(tag)) {
      selectedTags.push(tag);
    }
  }
  
  return selectedTags;
}

export function generateRandomTransactions(userId: string, numTransactions: number = 20): Transaction[] {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30); // Last 30 days

  const transactions: Transaction[] = [];

  for (let i = 0; i < numTransactions; i++) {
    const isIncome = Math.random() < 0.3; // 30% chance of being income
    const category = getRandomElement(isIncome ? categories.income : categories.expense);
    const amount = isIncome
      ? getRandomAmount(100, 5000)
      : getRandomAmount(10, 1000);

    const locationCategory = locations[category as keyof typeof locations];
    const location = locationCategory ? getRandomElement(locationCategory) : undefined;

    transactions.push({
      id: uuidv4(),
      userId,
      amount,
      type: isIncome ? 'credit' : 'debit',
      category,
      timestamp: getRandomDate(startDate, endDate),
      description: `${category} - ${isIncome ? 'Payment' : 'Purchase'}`,
      location,
      tags: getRandomTags(category)
    });
  }

  // Sort by timestamp in descending order
  return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function generateRandomUser(): User {
  const userId = uuidv4();
  const transactions = generateRandomTransactions(userId);
  
  const totalCredits = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalDebits = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    id: userId,
    name: 'New User',
    email: 'user@example.com',
    balance: Number((totalCredits - totalDebits).toFixed(2)),
    streak: {
      current: Math.floor(Math.random() * 5) + 1,
      lastLogin: new Date(),
      highestStreak: Math.floor(Math.random() * 10) + 5,
      multiplier: 1,
      streakProtection: Math.floor(Math.random() * 2),
    },
    preferences: {
      theme: Math.random() < 0.5 ? 'light' : 'dark',
      notificationsEnabled: true,
      musicPreferences: {
        genres: ['pop', 'rock'],
        favoriteArtists: ['Various'],
      },
      privacySettings: {
        shareInsights: true,
        shareAchievements: true,
      },
    },
    transactions,
    insightStats: {
      consecutiveDaysViewed: Math.floor(Math.random() * 7),
      lastViewed: new Date(),
      totalViews: Math.floor(Math.random() * 30),
    },
    budgetStats: {
      goalsSet: Math.floor(Math.random() * 3),
      goalsAchieved: Math.floor(Math.random() * 2),
      monthlyStreak: Math.floor(Math.random() * 2),
      lastUpdated: new Date(),
    },
    investmentStats: {
      totalInvestments: Math.floor(Math.random() * 5),
      categories: new Set(['stocks', 'bonds'].slice(0, Math.floor(Math.random() * 2) + 1)),
      returns: Number((Math.random() * 15).toFixed(1)),
      lastUpdated: new Date(),
    },
    achievements: [
      {
        id: '1',
        name: 'First Login',
        description: 'Complete your first login',
        category: 'streak',
        earned: true,
        date: new Date(),
        target: 1,
      }
    ],
  };
} 