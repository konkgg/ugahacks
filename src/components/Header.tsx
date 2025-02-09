'use client';

import { useState } from 'react';
import { Bell, User, Award } from 'lucide-react';
import { useUserStore } from '../store/userStore';

export const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useUserStore();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Award className="w-6 h-6 text-primary" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">Streak</span>
            <span className="text-lg font-bold">{user?.streak.current || 0}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <User className="w-6 h-6" />
          </button>
        </div>

        {showNotifications && (
          <div className="absolute top-16 right-4 w-80 bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4">
            <h3 className="font-semibold mb-2">Notifications</h3>
            <div className="space-y-2">
              <p className="text-sm">No new notifications</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}; 