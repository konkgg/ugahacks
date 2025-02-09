import { create } from 'zustand';
import { User, Transaction, UserStore, AIInsight, Achievement, UserState } from '../types';
import { generateRandomUser } from '../utils/mockDataGenerator';
import { persist, createJSONStorage } from 'zustand/middleware';

// Initial state that's consistent between server and client
const initialState: UserState = {
  user: null,
  transactions: [],
  insights: [],
  isAnimating: false,
  isHydrated: true
};

// Helper function to convert date strings to Date objects
const convertDates = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (obj instanceof Date) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(convertDates);
  }

  if (typeof obj === 'object') {
    const converted: any = {};
    for (const key in obj) {
      if (key === 'timestamp' || key === 'date' || key === 'lastLogin' || 
          key === 'lastViewed' || key === 'lastUpdated') {
        converted[key] = new Date(obj[key]);
      } else if (key === 'categories' && obj[key] instanceof Set) {
        converted[key] = new Set(Array.from(obj[key]));
      } else if (key === 'categories' && Array.isArray(obj[key])) {
        converted[key] = new Set(obj[key]);
      } else {
        converted[key] = convertDates(obj[key]);
      }
    }
    return converted;
  }

  return obj;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setUser: (user: User) => {
        const processedUser = convertDates(user);
        set({ 
          user: processedUser,
          transactions: processedUser.transactions || []
        });
      },
      
      hydrateStore: () => {
        const state = get();
        if (typeof window !== 'undefined') {
          try {
            const storedUser = localStorage.getItem('app-user');
            if (storedUser) {
              const userData = JSON.parse(storedUser);
              if (userData?.state?.user) {
                const processedData = convertDates(userData.state);
                set({
                  user: processedData.user,
                  transactions: processedData.user.transactions || [],
                  insights: processedData.insights || [],
                });
              }
            }
          } catch (error) {
            console.error('Error hydrating store:', error);
            localStorage.removeItem('app-user');
          }
        }
      },
      
      addTransaction: (transaction: Transaction) => {
        const processedTransaction = convertDates(transaction);
        set((state) => ({
          transactions: [processedTransaction, ...(state.transactions || [])],
          user: state.user ? {
            ...state.user,
            transactions: [processedTransaction, ...(state.user.transactions || [])],
            balance: transaction.type === 'credit'
              ? state.user.balance + transaction.amount
              : state.user.balance - transaction.amount,
          } : null,
        }));
      },
        
      updateBalance: (amount: number) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                balance: state.user.balance + amount,
              }
            : null,
        })),
        
      updateStreak: () =>
        set((state) => {
          if (!state.user) return state;
          
          const lastLogin = new Date(state.user.streak.lastLogin);
          const today = new Date();
          const diffDays = Math.floor(
            (today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24)
          );
          
          if (diffDays === 1) {
            // Perfect streak continuation
            return {
              user: {
                ...state.user,
                streak: {
                  ...state.user.streak,
                  current: state.user.streak.current + 1,
                  lastLogin: today,
                  highestStreak: Math.max(state.user.streak.highestStreak, state.user.streak.current + 1),
                },
              },
            };
          } else if (diffDays > 1 && state.user.streak.streakProtection > 0) {
            // Use streak protection
            return {
              user: {
                ...state.user,
                streak: {
                  ...state.user.streak,
                  current: state.user.streak.current + 1,
                  lastLogin: today,
                  streakProtection: state.user.streak.streakProtection - 1,
                },
              },
            };
          } else if (diffDays > 1) {
            // Streak broken
            return {
              user: {
                ...state.user,
                streak: {
                  ...state.user.streak,
                  current: 1,
                  lastLogin: today,
                  multiplier: 1,
                },
              },
            };
          }
          
          // Same day login, no streak change
          return {
            user: {
              ...state.user,
              streak: {
                ...state.user.streak,
                lastLogin: today,
              },
            },
          };
        }),
        
      addInsight: (insight: AIInsight) =>
        set((state) => ({
          insights: [insight, ...state.insights],
        })),
        
      updateAchievements: (achievement: Achievement) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                achievements: [...state.user.achievements, achievement],
              }
            : null,
        })),
        
      addMoney: (amount: number) =>
        set((state) => {
          if (!state.user) return state;
          
          const transaction: Transaction = {
            id: crypto.randomUUID(),
            userId: state.user.id,
            amount,
            type: 'credit',
            category: 'Deposit',
            timestamp: new Date(),
            description: 'Added money to account',
          };
          
          return {
            user: {
              ...state.user,
              balance: state.user.balance + amount,
              transactions: [transaction, ...state.user.transactions],
            },
            transactions: [transaction, ...state.transactions],
          };
        }),
        
      removeMoney: (amount: number) =>
        set((state) => {
          if (!state.user || state.user.balance < amount) return state;
          
          const transaction: Transaction = {
            id: crypto.randomUUID(),
            userId: state.user.id,
            amount,
            type: 'debit',
            category: 'Withdrawal',
            timestamp: new Date(),
            description: 'Removed money from account',
          };
          
          return {
            user: {
              ...state.user,
              balance: state.user.balance - amount,
              transactions: [transaction, ...state.user.transactions],
            },
            transactions: [transaction, ...state.transactions],
          };
        }),
    }),
    {
      name: 'app-user',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        transactions: state.transactions,
        insights: state.insights,
      }),
    }
  )
); 