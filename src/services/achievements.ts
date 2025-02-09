import type { User, Transaction, Achievement } from '../types';

const ACHIEVEMENTS = {
  SAVINGS_MILESTONES: [
    {
      id: 'savings-100',
      name: 'First $100 Saved',
      description: 'Save your first $100',
      category: 'savings',
      target: 100,
    },
    {
      id: 'savings-1000',
      name: 'Savings Master',
      description: 'Save $1,000',
      category: 'savings',
      target: 1000,
    },
  ],
  STREAK_MILESTONES: [
    {
      id: 'streak-7',
      name: 'Week Warrior',
      description: 'Maintain a 7-day login streak',
      category: 'streak',
      target: 7,
    },
    {
      id: 'streak-30',
      name: 'Monthly Master',
      description: 'Maintain a 30-day login streak',
      category: 'streak',
      target: 30,
    },
  ],
  TRANSACTION_MILESTONES: [
    {
      id: 'transactions-10',
      name: 'Getting Started',
      description: 'Complete 10 transactions',
      category: 'transaction',
      target: 10,
    },
    {
      id: 'transactions-100',
      name: 'Transaction Pro',
      description: 'Complete 100 transactions',
      category: 'transaction',
      target: 100,
    },
  ],
} as const;

export const checkAchievements = (user: User, transactions: Transaction[]): Achievement[] => {
  const newAchievements: Achievement[] = [];
  const existingAchievementIds = new Set(user.achievements.map(a => a.id));

  // Check savings achievements
  const totalSavings = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  ACHIEVEMENTS.SAVINGS_MILESTONES.forEach(milestone => {
    if (totalSavings >= milestone.target && !existingAchievementIds.has(milestone.id)) {
      newAchievements.push({
        ...milestone,
        earned: true,
        date: new Date(),
        progress: {
          current: totalSavings,
          target: milestone.target,
        },
      });
    }
  });

  // Check streak achievements
  ACHIEVEMENTS.STREAK_MILESTONES.forEach(milestone => {
    if (user.streak.current >= milestone.target && !existingAchievementIds.has(milestone.id)) {
      newAchievements.push({
        ...milestone,
        earned: true,
        date: new Date(),
        progress: {
          current: user.streak.current,
          target: milestone.target,
        },
      });
    }
  });

  // Check transaction achievements
  const transactionCount = transactions.length;
  ACHIEVEMENTS.TRANSACTION_MILESTONES.forEach(milestone => {
    if (transactionCount >= milestone.target && !existingAchievementIds.has(milestone.id)) {
      newAchievements.push({
        ...milestone,
        earned: true,
        date: new Date(),
        progress: {
          current: transactionCount,
          target: milestone.target,
        },
      });
    }
  });

  return newAchievements;
};

export const updateStreak = (user: User): User => {
  const now = new Date();
  const lastLogin = new Date(user.streak.lastLogin);
  const daysSinceLastLogin = Math.floor(
    (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceLastLogin === 1) {
    // Perfect streak continuation
    return {
      ...user,
      streak: {
        ...user.streak,
        current: user.streak.current + 1,
        lastLogin: now,
        highestStreak: Math.max(user.streak.highestStreak, user.streak.current + 1),
      },
    };
  } else if (daysSinceLastLogin > 1 && user.streak.streakProtection > 0) {
    // Use streak protection
    return {
      ...user,
      streak: {
        ...user.streak,
        current: user.streak.current + 1,
        lastLogin: now,
        streakProtection: user.streak.streakProtection - 1,
      },
    };
  } else if (daysSinceLastLogin > 1) {
    // Streak broken
    return {
      ...user,
      streak: {
        ...user.streak,
        current: 1,
        lastLogin: now,
        multiplier: 1,
      },
    };
  }

  // Same day login, no streak change
  return {
    ...user,
    streak: {
      ...user.streak,
      lastLogin: now,
    },
  };
}; 