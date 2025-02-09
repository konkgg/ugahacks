'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Send, Wallet, ChevronRight, Music, TrendingUp } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { generateFinancialInsights } from '../services/openai';
import type { Transaction, AIInsight } from '../types';

const QuickAction = ({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
  >
    <Icon className="w-6 h-6 mb-2 text-primary" />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const TransactionItem = ({ transaction }: { transaction: Transaction }) => (
  <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
    <div className="flex items-center space-x-4">
      <div className={`p-2 rounded-full ${transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
        {transaction.type === 'credit' ? '+' : '-'}
      </div>
      <div>
        <p className="font-medium">{transaction.description}</p>
        <p className="text-sm text-gray-500">{new Date(transaction.timestamp).toLocaleDateString()}</p>
      </div>
    </div>
    <span className={`font-bold ${transaction.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
      ${Math.abs(transaction.amount).toFixed(2)}
    </span>
  </div>
);

export const Dashboard = () => {
  const { user, transactions } = useUserStore();
  const [currentInsight, setCurrentInsight] = useState<AIInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInsights = async () => {
      if (!user || !transactions.length) return;
      
      setIsLoading(true);
      setError(null);
      try {
        const insight = await generateFinancialInsights(transactions, user.id);
        setCurrentInsight(insight);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate insights');
      } finally {
        setIsLoading(false);
      }
    };

    loadInsights();
  }, [user?.id, transactions]);

  const quickActions = [
    { icon: Send, label: 'Send', onClick: () => {} },
    { icon: CreditCard, label: 'Pay', onClick: () => {} },
    { icon: Wallet, label: 'Top Up', onClick: () => {} },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 pt-20 pb-24 space-y-6">
      {/* Balance Card */}
      <div className="bg-primary text-white p-6 rounded-xl shadow-lg">
        <p className="text-sm opacity-80">Current Balance</p>
        <h1 className="text-3xl font-bold">${user?.balance.toFixed(2) || '0.00'}</h1>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        {quickActions.map((action, index) => (
          <QuickAction key={index} {...action} />
        ))}
      </div>

      {/* AI Insights Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Daily Insights
          </h2>
          {isLoading && (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          )}
        </div>
        {error ? (
          <div className="text-red-500 dark:text-red-400">
            {error}
          </div>
        ) : isLoading ? (
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              {currentInsight?.summary || "No insights available for today yet."}
            </p>
            {currentInsight?.advice && (
              <div className="mt-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  💡 {currentInsight.advice}
                </p>
              </div>
            )}
            {currentInsight?.spendingAnalysis?.recommendations && 
             currentInsight.spendingAnalysis.recommendations.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2">Recommendations:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {currentInsight.spendingAnalysis.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Music Playlist Widget */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Music className="w-5 h-5 mr-2" />
            Your Financial Mood Mix
          </h2>
          {isLoading && (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          )}
        </div>
        {error ? (
          <div className="text-red-500 dark:text-red-400">
            Failed to generate playlist
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {currentInsight?.playlist?.map((song) => (
              <div key={song.id} className="flex items-center space-x-4 group hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition-colors">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-gray-300 dark:group-hover:bg-gray-600 transition-colors">
                  <Music className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <p className="font-medium">{song.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{song.artist}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">{song.reason}</p>
                </div>
              </div>
            ))}
            {!currentInsight?.playlist?.length && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No songs in your financial mood mix yet
              </p>
            )}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
        </div>
        <div className="max-h-[32rem] overflow-y-auto">
          {transactions.slice(0, 20).map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </div>
    </div>
  );
}; 