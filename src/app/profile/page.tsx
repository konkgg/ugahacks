'use client';

import React from 'react';
import { useUserStore } from '@/store/userStore';
import type { Achievement, UserStore } from '@/types';

export default function ProfilePage() {
  const user = useUserStore((state: UserStore) => state.user);

  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-24">
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Achievements</h2>
        <div className="space-y-4">
          {user?.achievements.map((achievement: Achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border ${
                achievement.earned
                  ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                  : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium dark:text-white">{achievement.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                  {achievement.earned && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Earned on {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {achievement.earned && (
                  <span className="text-green-600 dark:text-green-400">✓</span>
                )}
              </div>
            </div>
          ))}

          {(!user?.achievements || user.achievements.length === 0) && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No achievements yet
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
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