export interface UserPreferences {
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  musicPreferences: {
    genres: string[];
    favoriteArtists: string[];
  };
  privacySettings: {
    shareInsights: boolean;
    shareAchievements: boolean;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  streak: {
    current: number;
    lastLogin: Date;
    highestStreak: number;
    multiplier: number;
    streakProtection: number;
  };
  achievements: Achievement[];
  preferences: UserPreferences;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'savings' | 'streak' | 'transaction' | 'literacy';
  earned: boolean;
  date: Date;
  progress?: {
    current: number;
    target: number;
  };
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
  timestamp: Date;
  description: string;
  location?: string;
  tags?: string[];
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  mood: string;
  reason: string;
  url?: string;
}

export interface AIInsight {
  id: string;
  userId: string;
  date: Date;
  summary: string;
  advice: string;
  spendingAnalysis: {
    categories: Record<string, number>;
    trends: string[];
    recommendations: string[];
  };
  playlist: Song[];
}

export interface UserStore {
  user: User | null;
  transactions: Transaction[];
  insights: AIInsight[];
  setUser: (user: User) => void;
  addTransaction: (transaction: Transaction) => void;
  updateBalance: (amount: number) => void;
  updateStreak: () => void;
  addInsight: (insight: AIInsight) => void;
  updateAchievements: (achievement: Achievement) => void;
} 