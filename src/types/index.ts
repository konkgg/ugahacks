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
  transactions: Transaction[];
  insightStats: {
    consecutiveDaysViewed: number;
    lastViewed: Date;
    totalViews: number;
  };
  budgetStats: {
    goalsSet: number;
    goalsAchieved: number;
    monthlyStreak: number;
    lastUpdated: Date;
  };
  investmentStats: {
    totalInvestments: number;
    categories: Set<string>;
    returns: number;
    lastUpdated: Date;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'savings' | 'streak' | 'transaction' | 'literacy' | 'budget' | 'investment';
  earned: boolean;
  date: Date;
  target: number;
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

export interface ArtistImage {
  small: string;
  medium: string;
  large: string;
}

export interface Artist {
  name: string;
  images: ArtistImage;
  url?: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  artistImage?: string | null;
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

export interface UserState {
  user: User | null;
  transactions: Transaction[];
  insights: AIInsight[];
  isAnimating: boolean;
  isHydrated: boolean;
}

export interface UserStore extends UserState {
  setUser: (user: User) => void;
  addTransaction: (transaction: Transaction) => void;
  updateBalance: (amount: number) => void;
  updateStreak: () => void;
  addInsight: (insight: AIInsight) => void;
  updateAchievements: (achievement: Achievement) => void;
  addMoney: (amount: number) => void;
  removeMoney: (amount: number) => void;
  hydrateStore: () => void;
} 