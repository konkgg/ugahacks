'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useUserStore } from '@/store/userStore';

export default function TransactionsPage() {
  const transactions = useUserStore((state) => state.transactions);

  return (
    <MainLayout>
      <div className="max-w-md mx-auto px-4 pt-6">
        <h1 className="text-2xl font-bold mb-6">Transactions</h1>
        
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white rounded-xl shadow-sm p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`font-medium ${
                    transaction.type === 'credit'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'credit' ? '+' : '-'}$
                  {Math.abs(transaction.amount).toFixed(2)}
                </span>
              </div>
              <div className="mt-2">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                  {transaction.category}
                </span>
              </div>
            </div>
          ))}
          
          {transactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No transactions yet
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
} 