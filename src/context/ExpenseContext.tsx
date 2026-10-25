import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AppState, Transaction, Budget } from '../types';
import { loadData, saveData, clearData } from '../lib/storage';

interface ExpenseContextType extends AppState {
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, updatedTransaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  setInitialBalance: (amount: number) => void;
  updateBudget: (budget: Budget) => void;
  completeSetup: () => void;
  resetData: () => void;
  totalAdded: number;
  totalSpent: number;
  currentBalance: number;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(loadData());

  useEffect(() => {
    saveData(state);
  }, [state]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setState((prev) => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions],
    }));
  };

  const editTransaction = (id: string, updatedTransaction: Omit<Transaction, 'id'>) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) =>
        t.id === id ? { ...updatedTransaction, id } : t
      ),
    }));
  };

  const deleteTransaction = (id: string) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
  };

  const setInitialBalance = (amount: number) => {
    setState((prev) => ({ ...prev, initialBalance: amount }));
  };

  const updateBudget = (budget: Budget) => {
    setState((prev) => ({ ...prev, budget }));
  };

  const completeSetup = () => {
    setState((prev) => ({ ...prev, isSetupComplete: true }));
  };

  const resetData = () => {
    clearData();
    setState(loadData());
  };

  // Derived state calculations
  const totalAdded = state.initialBalance + state.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = state.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalAdded - totalSpent;

  return (
    <ExpenseContext.Provider
      value={{
        ...state,
        addTransaction,
        editTransaction,
        deleteTransaction,
        setInitialBalance,
        updateBudget,
        completeSetup,
        resetData,
        totalAdded,
        totalSpent,
        currentBalance,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
