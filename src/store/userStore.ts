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
      const newTransaction = {
        id: state.transactions.length + 1,
        amount: amount * 10,
        type: 'deposit',
        description: 'Money Added',
        date: new Date().toISOString().split('T')[0],
      };
      
      return {
        user: {
          ...state.user,
          balance: state.user.balance + (amount * 10)
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
      const newTransaction = {
        id: state.transactions.length + 1,
        amount: amount * 10,
        type: 'withdrawal',
        description: 'Money Withdrawn',
        date: new Date().toISOString().split('T')[0],
      };
      
      return {
        user: {
          ...state.user,
          balance: state.user.balance - (amount * 10)
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