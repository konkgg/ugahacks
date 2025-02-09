'use client';

import React from 'react';
import { useUserStore } from '@/store/userStore';
import type { Achievement, UserStore } from '@/types';
import { ACHIEVEMENTS } from '@/services/achievements';

export default function ProfilePage() {
  const user = useUserStore((state: UserStore) => state.user);

  // Function to get achievement progress
  const getAchievementProgress = (achievement: Achievement) => {
    if (!user) return 0;
    
    switch (achievement.category) {
      case 'savings':
        const totalSavings = user.transactions?.filter(t => t.type === 'credit')
          .reduce((sum, t) => sum + t.amount, 0) || 0;
        return Math.min((totalSavings / achievement.target) * 100, 100);
      
      case 'streak':
        return Math.min((user.streak.current / achievement.target) * 100, 100);
      
      case 'transaction':
        return Math.min((user.transactions?.length || 0) / achievement.target * 100, 100);
      
      case 'literacy':
        return Math.min((user.insightStats?.consecutiveDaysViewed || 0) / achievement.target * 100, 100);
      
      case 'budget':
        switch (achievement.id) {
          case 'budget-first-goal':
            return Math.min((user.budgetStats?.goalsSet || 0) / achievement.target * 100, 100);
          case 'budget-goal-achieved':
            return Math.min((user.budgetStats?.goalsAchieved || 0) / achievement.target * 100, 100);
          case 'budget-streak-3':
            return Math.min((user.budgetStats?.monthlyStreak || 0) / achievement.target * 100, 100);
          default:
            return 0;
        }
      
      case 'investment':
        switch (achievement.id) {
          case 'investment-first':
            return Math.min((user.investmentStats?.totalInvestments || 0) / achievement.target * 100, 100);
          case 'investment-diverse':
            return Math.min((user.investmentStats?.categories?.size || 0) / achievement.target * 100, 100);
          case 'investment-growth':
            return Math.min((user.investmentStats?.returns || 0) / achievement.target * 100, 100);
          default:
            return 0;
        }
      
      default:
        return 0;
    }
  };

  // Function to check if achievement is earned
  const isAchievementEarned = (achievementId: string) => {
    return user?.achievements.some(a => a.id === achievementId) || false;
  };

  // Function to get achievement earn date
  const getAchievementDate = (achievementId: string) => {
    return user?.achievements.find(a => a.id === achievementId)?.date;
  };

  const achievementCategories = {
    savings: { title: 'Savings', achievements: ACHIEVEMENTS.SAVINGS_MILESTONES },
    streak: { title: 'Login Streaks', achievements: ACHIEVEMENTS.STREAK_MILESTONES },
    transaction: { title: 'Transactions', achievements: ACHIEVEMENTS.TRANSACTION_MILESTONES },
    literacy: { title: 'Financial Literacy', achievements: ACHIEVEMENTS.FINANCIAL_LITERACY },
    budget: { title: 'Budgeting', achievements: ACHIEVEMENTS.BUDGET_GOALS },
    investment: { title: 'Investments', achievements: ACHIEVEMENTS.INVESTMENT_MILESTONES },
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-20 pb-24">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center">
            <span className="text-2xl text-white font-bold">
              {user?.name.charAt(0) ?? 'U'}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold dark:text-white">{user?.name ?? 'User'}</h1>
            <p className="text-gray-500 dark:text-gray-400">Member since {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold dark:text-white">Achievements</h2>
        
        {Object.entries(achievementCategories).map(([category, { title, achievements }]) => (
          <div key={category} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold mb-4 dark:text-white">{title}</h3>
            <div className="space-y-4">
              {achievements.map((achievement) => {
                const isEarned = isAchievementEarned(achievement.id);
                const progress = getAchievementProgress(achievement);
                const earnDate = getAchievementDate(achievement.id);

                return (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border ${
                      isEarned
                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                        : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium dark:text-white">{achievement.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                        {isEarned && earnDate && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Earned on {new Date(earnDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {isEarned && (
                        <span className="text-green-600 dark:text-green-400">✓</span>
                      )}
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            isEarned
                              ? 'bg-green-500 dark:bg-green-400'
                              : 'bg-blue-500 dark:bg-blue-400'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Progress: {Math.round(progress)}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mt-6">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Statistics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Current Streak</p>
            <p className="text-2xl font-bold dark:text-white">{user?.streak.current ?? 0} days</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Highest Streak</p>
            <p className="text-2xl font-bold dark:text-white">{user?.streak.highestStreak ?? 0} days</p>
          </div>
        </div>
      </div>
    </div>
  );
} 