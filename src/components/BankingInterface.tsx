'use client';

import { useUserStore } from '@/store/userStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

function formatDate(date: Date | string): string {
  if (typeof date === 'string') return date;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export default function BankingInterface() {
  const { user, transactions, isAnimating, addMoney, removeMoney } = useUserStore();

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white p-4">
      <div className="max-w-2xl mx-auto">
        {/* Balance Display */}
        <motion.div
          className={`text-4xl font-medium mb-8 ${
            isAnimating ? 'text-green-400' : 'text-white'
          }`}
          animate={{
            scale: isAnimating ? 1.05 : 1,
            transition: { duration: 0.2 }
          }}
        >
          ${user.balance.toLocaleString()}
        </motion.div>

        {/* Action Buttons */}
        <div className="space-y-2 mb-8">
          <button
            onClick={() => addMoney(1000)}
            className="w-full bg-[#2A2A2A] hover:bg-[#3A3A3A] p-4 rounded-lg flex items-center justify-between group transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-green-500/10 p-2 rounded-md">
                <span className="text-green-500 text-xl">↑</span>
              </div>
              <span className="font-medium">Send Money</span>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
          </button>

          <button
            onClick={() => removeMoney(1000)}
            className="w-full bg-[#2A2A2A] hover:bg-[#3A3A3A] p-4 rounded-lg flex items-center justify-between group transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500/10 p-2 rounded-md">
                <span className="text-blue-500 text-xl">↓</span>
              </div>
              <span className="font-medium">Add Money</span>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Transactions */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-400 mb-4">Recent Transactions</h2>
          <div className="space-y-1">
            <AnimatePresence>
              {transactions.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-[#2A2A2A] hover:bg-[#3A3A3A] p-4 rounded-lg transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-md ${
                        transaction.type === 'deposit' 
                          ? 'bg-green-500/10' 
                          : 'bg-red-500/10'
                      }`}>
                        <span className={`text-xl ${
                          transaction.type === 'deposit' 
                            ? 'text-green-500' 
                            : 'text-red-500'
                        }`}>
                          {transaction.type === 'deposit' ? '↑' : '↓'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                      </div>
                    </div>
                    <p className={`font-medium ${
                      transaction.type === 'deposit' 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
} 