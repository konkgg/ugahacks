'use client';

import { Award } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { ImageUploadButton } from './ImageUploadButton';

export const Header = () => {
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

        <div className="flex items-center">
          <ImageUploadButton />
        </div>
      </div>
    </header>
  );
}; 