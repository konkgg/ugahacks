'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Send, Wallet, ChevronRight, Music, TrendingUp } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { generateFinancialInsights } from '../services/openai';
import { enrichSongsWithArtistInfo } from '../utils/artistUtils';
import Playlist from './Playlist';
import type { Transaction, AIInsight, Song } from '../types';

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
      <div className={`p-2 rounded-full ${
        transaction.type === 'credit' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
      }`}>
        {transaction.type === 'credit' ? '+' : '-'}
      </div>
      <div>
        <p className="font-medium">{transaction.description}</p>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span>{new Date(transaction.timestamp).toLocaleString()}</span>
          <span>•</span>
          <span className="capitalize">{transaction.category}</span>
          {transaction.tags && transaction.tags.length > 0 && (
            <>
              <span>•</span>
              <div className="flex gap-1">
                {transaction.tags.map((tag, index) => (
                  <span key={index} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    <span className={`font-bold ${
      transaction.type === 'credit' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'
    }`}>
      ${Math.abs(transaction.amount).toFixed(2)}
    </span>
  </div>
);

export const Dashboard = () => {
  const { user, transactions, addMoney, removeMoney, addTransaction } = useUserStore();
  const [currentInsight, setCurrentInsight] = useState<AIInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enrichedPlaylist, setEnrichedPlaylist] = useState<Song[]>([]);
  const [amount, setAmount] = useState<number>(0);

  const handleTransaction = (type: 'send' | 'pay' | 'topup') => {
    if (!user) return;
    
    const transactionAmount = 10; // Default amount for demonstration
    
    switch (type) {
      case 'send':
        if (user.balance >= transactionAmount) {
          removeMoney(1); // Removes $10 and creates transaction
        }
        break;
      case 'pay':
        if (user.balance >= transactionAmount) {
          removeMoney(1); // Removes $10 and creates transaction
        }
        break;
      case 'topup':
        addMoney(1); // Adds $10 and creates transaction
        break;
    }

    // Trigger insights refresh
    loadInsights();
  };

  const loadInsights = async () => {
    if (!user || !transactions.length) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const insight = await generateFinancialInsights(transactions, user.id)
        .catch(error => {
          console.error('Failed to generate insights:', error);
          throw new Error('Could not generate financial insights. Please try again later.');
        });
      
      setCurrentInsight(insight);
      
      // Enrich songs with artist info
      if (insight.playlist?.length) {
        try {
          const enrichedSongs = await enrichSongsWithArtistInfo(insight.playlist)
            .catch(error => {
              console.error('Failed to enrich songs:', error);
              return insight.playlist; // Fallback to original playlist without enrichment
            });
          setEnrichedPlaylist(enrichedSongs);
        } catch (err) {
          console.error('Error enriching songs:', err);
          setEnrichedPlaylist(insight.playlist); // Fallback to original playlist
        }
      }
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, [user?.id, transactions]);

  const quickActions = [
    { 
      icon: Send, 
      label: 'Send', 
      onClick: () => handleTransaction('send')
    },
    { 
      icon: CreditCard, 
      label: 'Pay', 
      onClick: () => handleTransaction('pay')
    },
    { 
      icon: Wallet, 
      label: 'Top Up', 
      onClick: () => handleTransaction('topup')
    },
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
          <Playlist tracks={currentInsight?.playlist || []} />
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