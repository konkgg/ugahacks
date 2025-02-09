import { create } from 'zustand';
import { User, Transaction, UserStore } from '../types';
import { mockUser, mockTransactions } from '../data/mockData';

export const useUserStore = create<UserStore>((set) => ({
  user: mockUser,
  transactions: mockTransactions,
  isAnimating: false,
  
  setUser: (user: User) => set({ user }),
  
  addTransaction: (transaction: Transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),
    
  updateBalance: (amount: number) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            balance: state.user.balance + amount,
          }
        : null,
    })),
    
  updateVisitStreak: () =>
    set((state) => {
      if (!state.user) return state;
      
      const lastVisit = new Date(state.user.visitStreak.lastVisit);
      const today = new Date();
      const diffDays = Math.floor(
        (today.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      return {
        user: {
          ...state.user,
          visitStreak: {
            currentStreak: diffDays === 1 ? state.user.visitStreak.currentStreak + 1 : 1,
            lastVisit: today,
            totalVisits: state.user.visitStreak.totalVisits + 1,
          },
        },
      };
    }),
  
  addMoney: (amount: number) => {
    set((state) => {
      if (!state.user) return state;
      
      const transactionAmount = amount * 10;
      const now = new Date();
      
      const newTransaction: Transaction = {
        id: `tx-${Date.now()}`,
        userId: state.user.id,
        amount: transactionAmount,
        type: 'credit',
        category: 'deposit',
        timestamp: now,
        description: 'Account Top Up',
        tags: ['deposit', 'top-up']
      };
      
      return {
        user: {
          ...state.user,
          balance: state.user.balance + transactionAmount
        },
        isAnimating: true,
        transactions: [newTransaction, ...state.transactions],
      };
    });
    
    setTimeout(() => {
      set({ isAnimating: false });
    }, 1000);
  },
  
  removeMoney: (amount: number) => {
    set((state) => {
      if (!state.user) return state;
      
      const transactionAmount = amount * 10;
      const now = new Date();
      
      const newTransaction: Transaction = {
        id: `tx-${Date.now()}`,
        userId: state.user.id,
        amount: transactionAmount,
        type: 'debit',
        category: 'withdrawal',
        timestamp: now,
        description: 'Money Withdrawn',
        tags: ['withdrawal']
      };
      
      return {
        user: {
          ...state.user,
          balance: state.user.balance - transactionAmount
        },
        isAnimating: true,
        transactions: [newTransaction, ...state.transactions],
      };
    });
    
    setTimeout(() => {
      set({ isAnimating: false });
    }, 1000);
  },
})); 