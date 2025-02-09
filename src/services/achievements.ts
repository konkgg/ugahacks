import type { User, Transaction, Achievement } from '../types';

export const ACHIEVEMENTS = {
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
    {
      id: 'savings-5000',
      name: 'Savings Expert',
      description: 'Save $5,000',
      category: 'savings',
      target: 5000,
    },
    {
      id: 'savings-10000',
      name: 'Savings Legend',
      description: 'Save $10,000',
      category: 'savings',
      target: 10000,
    }
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
    {
      id: 'streak-90',
      name: 'Quarterly Champion',
      description: 'Maintain a 90-day login streak',
      category: 'streak',
      target: 90,
    },
    {
      id: 'streak-365',
      name: 'Year of Excellence',
      description: 'Maintain a 365-day login streak',
      category: 'streak',
      target: 365,
    }
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
    {
      id: 'transactions-500',
      name: 'Transaction Master',
      description: 'Complete 500 transactions',
      category: 'transaction',
      target: 500,
    },
    {
      id: 'transactions-1000',
      name: 'Transaction Legend',
      description: 'Complete 1,000 transactions',
      category: 'transaction',
      target: 1000,
    }
  ],
  FINANCIAL_LITERACY: [
    {
      id: 'literacy-first-insight',
      name: 'Financial Learner',
      description: 'View your first financial insight',
      category: 'literacy',
      target: 1,
    },
    {
      id: 'literacy-week-insights',
      name: 'Weekly Analyst',
      description: 'View financial insights for 7 consecutive days',
      category: 'literacy',
      target: 7,
    },
    {
      id: 'literacy-month-insights',
      name: 'Financial Advisor',
      description: 'View financial insights for 30 consecutive days',
      category: 'literacy',
      target: 30,
    }
  ],
  BUDGET_GOALS: [
    {
      id: 'budget-first-goal',
      name: 'Goal Setter',
      description: 'Set your first budget goal',
      category: 'budget',
      target: 1,
    },
    {
      id: 'budget-goal-achieved',
      name: 'Goal Achiever',
      description: 'Achieve your first budget goal',
      category: 'budget',
      target: 1,
    },
    {
      id: 'budget-streak-3',
      name: 'Budget Master',
      description: 'Achieve budget goals for 3 consecutive months',
      category: 'budget',
      target: 3,
    }
  ],
  INVESTMENT_MILESTONES: [
    {
      id: 'investment-first',
      name: 'First Investment',
      description: 'Make your first investment',
      category: 'investment',
      target: 1,
    },
    {
      id: 'investment-diverse',
      name: 'Diverse Portfolio',
      description: 'Invest in 3 different categories',
      category: 'investment',
      target: 3,
    },
    {
      id: 'investment-growth',
      name: 'Growth Investor',
      description: 'Achieve 10% return on investments',
      category: 'investment',
      target: 10,
    }
  ]
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

  // Check financial literacy achievements
  const insightViewDays = user.insightStats?.consecutiveDaysViewed || 0;
  ACHIEVEMENTS.FINANCIAL_LITERACY.forEach(milestone => {
    if (insightViewDays >= milestone.target && !existingAchievementIds.has(milestone.id)) {
      newAchievements.push({
        ...milestone,
        earned: true,
        date: new Date(),
        progress: {
          current: insightViewDays,
          target: milestone.target,
        },
      });
    }
  });

  // Check budget achievements
  const budgetGoals = user.budgetStats || { goalsSet: 0, goalsAchieved: 0, monthlyStreak: 0 };
  ACHIEVEMENTS.BUDGET_GOALS.forEach(milestone => {
    let current = 0;
    switch (milestone.id) {
      case 'budget-first-goal':
        current = budgetGoals.goalsSet;
        break;
      case 'budget-goal-achieved':
        current = budgetGoals.goalsAchieved;
        break;
      case 'budget-streak-3':
        current = budgetGoals.monthlyStreak;
        break;
    }
    
    if (current >= milestone.target && !existingAchievementIds.has(milestone.id)) {
      newAchievements.push({
        ...milestone,
        earned: true,
        date: new Date(),
        progress: {
          current,
          target: milestone.target,
        },
      });
    }
  });

  // Check investment achievements
  const investmentStats = user.investmentStats || { 
    totalInvestments: 0, 
    categories: new Set(), 
    returns: 0 
  };
  
  ACHIEVEMENTS.INVESTMENT_MILESTONES.forEach(milestone => {
    let current = 0;
    switch (milestone.id) {
      case 'investment-first':
        current = investmentStats.totalInvestments;
        break;
      case 'investment-diverse':
        current = investmentStats.categories.size;
        break;
      case 'investment-growth':
        current = investmentStats.returns;
        break;
    }
    
    if (current >= milestone.target && !existingAchievementIds.has(milestone.id)) {
      newAchievements.push({
        ...milestone,
        earned: true,
        date: new Date(),
        progress: {
          current,
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