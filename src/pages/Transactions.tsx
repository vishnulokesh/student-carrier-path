import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { formatCurrency } from '../lib/utils';
import { TransactionModal } from '../components/TransactionModal';
import { Search, Edit2, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Transaction } from '../types';

export const Transactions: React.FC = () => {
  const { transactions, deleteTransaction, initialBalance } = useExpense();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const openEditModal = (t: Transaction) => {
    setEditingTransaction(t);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(false);
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.sourceOrWhere.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (t.note || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  // Calculate running balance for each transaction (assumes transactions are sorted newest first)
  // We need to work backwards from current balance, or compute forwards.
  // Actually, computing forwards is safer.
  const transactionsReversed = [...transactions].reverse();
  let runningBal = initialBalance;
  const balances = new Map<string, number>();
  
  transactionsReversed.forEach(t => {
    if (t.type === 'income') {
      runningBal += t.amount;
    } else {
      runningBal -= t.amount;
    }
    balances.set(t.id, runningBal);
  });

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-[var(--muted-foreground)]">History of your income and expenses.</p>
      </div>

      <Card className="flex flex-col flex-1 overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--muted-foreground)]" />
              <Input 
                placeholder="Search transactions..." 
                className="pl-9"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select className="w-[130px]" value={filterType} onChange={e => setFilterType(e.target.value)}>
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </Select>
              <Select className="w-[140px]" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                <option value="all">All Categories</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="College">College</option>
                <option value="Shopping">Shopping</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Income">Income</option>
                <option value="Other">Other</option>
              </Select>
            </div>
          </div>
        </div>

        <CardContent className="p-0 flex-1 overflow-auto">
          <div className="min-w-[800px]">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-[var(--muted)] text-[var(--muted-foreground)] sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Where / Source</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Balance After</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-[var(--muted-foreground)]">
                      No transactions found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map(t => (
                    <tr key={t.id} className="hover:bg-[var(--accent)]/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(t.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          t.type === 'income' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {t.type === 'income' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {t.type === 'income' ? 'Added' : 'Expense'}
                        </span>
                      </td>
                      <td className={`px-6 py-4 font-semibold ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(t.amount)}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {t.sourceOrWhere}
                        {t.note && <p className="text-xs text-[var(--muted-foreground)] font-normal mt-0.5">{t.note}</p>}
                      </td>
                      <td className="px-6 py-4 text-[var(--muted-foreground)]">
                        {t.category}
                      </td>
                      <td className="px-6 py-4 font-medium text-[var(--muted-foreground)]">
                        {formatCurrency(balances.get(t.id) || 0)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20" onClick={() => openEditModal(t)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => deleteTransaction(t.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={closeEditModal} 
        editingTransaction={editingTransaction}
      />
    </div>
  );
};
