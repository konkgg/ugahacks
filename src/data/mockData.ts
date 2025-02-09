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
  {
    id: '5',
    userId: '1',
    amount: 89.99,
    type: 'debit',
    category: 'Shopping',
    timestamp: new Date('2024-03-12'),
    description: 'Amazon Purchase',
    tags: ['electronics', 'gadgets'],
  },
  {
    id: '6',
    userId: '1',
    amount: 1200,
    type: 'credit',
    category: 'Salary',
    timestamp: new Date('2024-03-11'),
    description: 'Monthly Salary',
  },
  {
    id: '7',
    userId: '1',
    amount: 45.50,
    type: 'debit',
    category: 'Dining',
    timestamp: new Date('2024-03-11'),
    description: 'Restaurant - Italian Dinner',
    location: 'La Cucina',
  },
  {
    id: '8',
    userId: '1',
    amount: 120,
    type: 'debit',
    category: 'Utilities',
    timestamp: new Date('2024-03-10'),
    description: 'Electricity Bill',
  },
  {
    id: '9',
    userId: '1',
    amount: 60,
    type: 'debit',
    category: 'Transportation',
    timestamp: new Date('2024-03-10'),
    description: 'Monthly Transit Pass',
  },
  {
    id: '10',
    userId: '1',
    amount: 500,
    type: 'credit',
    category: 'Freelance',
    timestamp: new Date('2024-03-09'),
    description: 'Web Development Project',
    tags: ['coding', 'freelance'],
  },
  {
    id: '11',
    userId: '1',
    amount: 75.99,
    type: 'debit',
    category: 'Health',
    timestamp: new Date('2024-03-09'),
    description: 'Pharmacy - Medications',
  },
  {
    id: '12',
    userId: '1',
    amount: 29.99,
    type: 'debit',
    category: 'Entertainment',
    timestamp: new Date('2024-03-08'),
    description: 'Spotify Premium',
  },
  {
    id: '13',
    userId: '1',
    amount: 1500,
    type: 'debit',
    category: 'Housing',
    timestamp: new Date('2024-03-08'),
    description: 'Monthly Rent Payment',
  },
  {
    id: '14',
    userId: '1',
    amount: 300,
    type: 'credit',
    category: 'Refund',
    timestamp: new Date('2024-03-07'),
    description: 'Tax Refund',
  },
  {
    id: '15',
    userId: '1',
    amount: 85,
    type: 'debit',
    category: 'Shopping',
    timestamp: new Date('2024-03-07'),
    description: 'Clothing Purchase',
    location: 'Urban Outfitters',
    tags: ['fashion', 'apparel'],
  },
  {
    id: '16',
    userId: '1',
    amount: 150,
    type: 'debit',
    category: 'Education',
    timestamp: new Date('2024-03-06'),
    description: 'Online Course Subscription',
    tags: ['learning', 'development'],
  },
  {
    id: '17',
    userId: '1',
    amount: 40,
    type: 'debit',
    category: 'Groceries',
    timestamp: new Date('2024-03-06'),
    description: 'Weekly Grocery Shopping',
    location: 'Whole Foods',
  },
  {
    id: '18',
    userId: '1',
    amount: 200,
    type: 'credit',
    category: 'Gift',
    timestamp: new Date('2024-03-05'),
    description: 'Birthday Money',
  },
  {
    id: '19',
    userId: '1',
    amount: 65,
    type: 'debit',
    category: 'Fitness',
    timestamp: new Date('2024-03-05'),
    description: 'Gym Membership',
    tags: ['health', 'wellness'],
  },
  {
    id: '20',
    userId: '1',
    amount: 95,
    type: 'debit',
    category: 'Pet Care',
    timestamp: new Date('2024-03-04'),
    description: 'Veterinary Checkup',
    tags: ['pet', 'healthcare'],
  }
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