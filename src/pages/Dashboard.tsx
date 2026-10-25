import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PlusCircle, MinusCircle, Wallet, ArrowUpRight, ArrowDownRight, TrendingUp, Receipt } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { TransactionModal } from '../components/TransactionModal';
import { isToday } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { currentBalance, totalAdded, totalSpent, transactions } = useExpense();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'income' | 'expense'>('expense');

  const todayTransactions = transactions.filter(t => isToday(new Date(t.date)));
  const spentToday = todayTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const openModal = (type: 'income' | 'expense') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-[var(--muted-foreground)]">Overview of your finances</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button onClick={() => openModal('income')} className="flex-1 sm:flex-none gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
            <PlusCircle className="h-4 w-4" />
            Add Money
          </Button>
          <Button onClick={() => openModal('expense')} className="flex-1 sm:flex-none gap-2" variant="destructive">
            <MinusCircle className="h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6 flex flex-col gap-1">
            <div className="flex items-center justify-between text-[var(--muted-foreground)]">
              <span className="text-sm font-medium">Total Balance</span>
              <Wallet className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold">{formatCurrency(currentBalance)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col gap-1">
            <div className="flex items-center justify-between text-[var(--muted-foreground)]">
              <span className="text-sm font-medium">Spent Today</span>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {formatCurrency(spentToday)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col gap-1">
            <div className="flex items-center justify-between text-[var(--muted-foreground)]">
              <span className="text-sm font-medium">Total Spent</span>
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(totalSpent)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col gap-1">
            <div className="flex items-center justify-between text-[var(--muted-foreground)]">
              <span className="text-sm font-medium">Money Added</span>
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalAdded)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col h-[400px]">
          <div className="p-6 border-b border-[var(--border)]">
            <h2 className="font-semibold text-lg">Today's Spending</h2>
          </div>
          <CardContent className="p-0 flex-1 overflow-y-auto">
            {todayTransactions.filter(t => t.type === 'expense').length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[var(--muted-foreground)] p-6 text-center">
                <TrendingUp className="h-10 w-10 mb-2 opacity-20" />
                <p>No expenses today.</p>
                <p className="text-sm">You are doing great!</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {todayTransactions.filter(t => t.type === 'expense').map(t => (
                  <div key={t.id} className="flex justify-between items-center p-4 hover:bg-[var(--accent)]/50 transition-colors">
                    <div>
                      <p className="font-medium">{t.sourceOrWhere}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">{t.category}</p>
                    </div>
                    <div className="font-semibold text-red-600 dark:text-red-400">
                      -{formatCurrency(t.amount)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col h-[400px]">
          <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
            <h2 className="font-semibold text-lg">Recent Transactions</h2>
          </div>
          <CardContent className="p-0 flex-1 overflow-y-auto">
            {recentTransactions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[var(--muted-foreground)] p-6 text-center">
                <Receipt className="h-10 w-10 mb-2 opacity-20" />
                <p>No transactions yet.</p>
                <Button variant="link" onClick={() => openModal('expense')} className="mt-2">
                  Start tracking
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {recentTransactions.map(t => (
                  <div key={t.id} className="flex justify-between items-center p-4 hover:bg-[var(--accent)]/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-red-100 text-red-600 dark:bg-red-900/30'}`}>
                        {t.type === 'income' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium">{t.sourceOrWhere}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {new Date(t.date).toLocaleDateString()} &middot; {t.category}
                        </p>
                      </div>
                    </div>
                    <div className={`font-semibold ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        defaultType={modalType} 
      />
    </div>
  );
};
