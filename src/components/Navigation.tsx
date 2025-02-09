'use client';

import { Home, BarChart2, Clock, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export const Navigation = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ icon: Icon, label, path }) => {
            const isActive = pathname === path;
            return (
              <button
                key={path}
                onClick={() => router.push(path)}
                className={`flex flex-col items-center space-y-1.5 w-full py-3 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}; 