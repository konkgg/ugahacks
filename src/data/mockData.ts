import { User, Transaction } from '../types';
import mockData from './mockData.json';

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    userId: '1',
    amount: 25000,
    type: 'credit',
    category: 'Investment',
    timestamp: new Date('2024-03-15'),
    description: 'Investment Return',
  },
  {
    id: '2',
    userId: '1',
    amount: 15000,
    type: 'debit',
    category: 'Property',
    timestamp: new Date('2024-03-14'),
    description: 'Property Purchase',
  },
  {
    id: '3',
    userId: '1',
    amount: 50000,
    type: 'credit',
    category: 'Business',
    timestamp: new Date('2024-03-13'),
    description: 'Business Revenue',
  },
  {
    id: '4',
    userId: '1',
    amount: 35.99,
    type: 'debit',
    category: 'Entertainment',
    timestamp: new Date('2024-03-12'),
    description: 'Netflix subscription',
  },
];

export const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  balance: 1250.75,
  streak: {
    current: 3,
    lastLogin: new Date(),
    highestStreak: 3,
    multiplier: 1,
    streakProtection: 1,
  },
  preferences: {
    theme: 'light',
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
  transactions: mockTransactions,
  insightStats: {
    consecutiveDaysViewed: 3,
    lastViewed: new Date(),
    totalViews: 15,
  },
  budgetStats: {
    goalsSet: 2,
    goalsAchieved: 1,
    monthlyStreak: 1,
    lastUpdated: new Date(),
  },
  investmentStats: {
    totalInvestments: 3,
    categories: new Set(['stocks', 'bonds']),
    returns: 8.5,
    lastUpdated: new Date(),
  },
  achievements: [
    {
      id: '1',
      name: 'First Login',
      description: 'Complete your first login',
      category: 'streak',
      earned: true,
      date: new Date('2024-01-01'),
      target: 1,
    },
    {
      id: '2',
      name: '3 Day Streak',
      description: 'Login for 3 consecutive days',
      category: 'streak',
      earned: true,
      date: new Date('2024-01-03'),
      target: 3,
    },
    {
      id: '3',
      name: 'First Transaction',
      description: 'Complete your first transaction',
      category: 'transaction',
      earned: true,
      date: new Date('2024-01-02'),
      target: 1,
    },
    {
      id: 'budget-first-goal',
      name: 'Goal Setter',
      description: 'Set your first budget goal',
      category: 'budget',
      earned: true,
      date: new Date('2024-01-15'),
      target: 1,
    },
    {
      id: 'investment-first',
      name: 'First Investment',
      description: 'Make your first investment',
      category: 'investment',
      earned: true,
      date: new Date('2024-02-01'),
      target: 1,
    },
  ],
};

// Type assertion if needed
export const typedMockData = mockData as {
  users: Array<{
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }>;
  products: Array<{
    id: number;
    name: string;
    price: number;
    description: string;
    inStock: boolean;
  }>;
}; 