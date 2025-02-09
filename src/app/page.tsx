'use client';

import { useEffect } from 'react';
import { Dashboard } from '../components/Dashboard';
import { useUserStore } from '../store/userStore';
import { generateFinancialInsights } from '../services/openai';
import { checkAchievements, updateStreak } from '../services/achievements';

export default function Home() {
  const { user, transactions, setUser } = useUserStore();

  useEffect(() => {
    if (user) {
      // Update streak on page load
      const updatedUser = updateStreak(user);
      setUser(updatedUser);

      // Check for new achievements
      const newAchievements = checkAchievements(updatedUser, transactions);
      if (newAchievements.length > 0) {
        setUser({
          ...updatedUser,
          achievements: [...updatedUser.achievements, ...newAchievements],
        });
      }

      // Generate new insights
      generateFinancialInsights(transactions, user.id).catch(console.error);
    }
  }, [user?.id]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to Financial Wellness</h1>
          <p className="text-gray-600 dark:text-gray-300">Please sign in to continue</p>
        </div>
      </div>
    );
  }

  return <Dashboard />;
} 