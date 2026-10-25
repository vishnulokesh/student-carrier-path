import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { useExpense } from '../context/ExpenseContext';
import type { TransactionType, Category, Transaction } from '../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: TransactionType;
  editingTransaction?: Transaction | null;
}

const categories: Category[] = [
  'Food', 'Transport', 'College', 'Shopping', 'Entertainment',
  'Bills', 'Health', 'Education', 'Personal', 'Other'
];

export const TransactionModal: React.FC<TransactionModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultType = 'expense',
  editingTransaction
}) => {
  const { addTransaction, editTransaction } = useExpense();
  
  const [type, setType] = useState<TransactionType>(defaultType);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [sourceOrWhere, setSourceOrWhere] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setDate(editingTransaction.date);
      setSourceOrWhere(editingTransaction.sourceOrWhere);
      setCategory(editingTransaction.category);
      setNote(editingTransaction.note || '');
    } else {
      setType(defaultType);
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setSourceOrWhere('');
      setCategory('Food');
      setNote('');
    }
    setError('');
  }, [isOpen, defaultType, editingTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }
    if (!sourceOrWhere.trim()) {
      setError(`Please enter a valid ${type === 'income' ? 'source' : 'location/payee'}.`);
      return;
    }

    const transactionData = {
      type,
      amount: parsedAmount,
      date,
      sourceOrWhere,
      category: type === 'income' ? 'Income' as Category : category,
      note
    };

    if (editingTransaction) {
      editTransaction(editingTransaction.id, transactionData);
    } else {
      addTransaction(transactionData);
    }

    onClose();
  };

  const title = editingTransaction 
    ? 'Edit Transaction' 
    : type === 'income' ? 'Add Money' : 'Add Expense';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 text-red-700 text-sm rounded-md border border-red-200">
            {error}
          </div>
        )}

        {!editingTransaction && (
          <div className="flex gap-2 p-1 bg-[var(--accent)] rounded-lg">
            <button
              type="button"
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${type === 'expense' ? 'bg-[var(--card)] text-[var(--card-foreground)] shadow-sm' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}
              onClick={() => setType('expense')}
            >
              Expense
            </button>
            <button
              type="button"
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${type === 'income' ? 'bg-[var(--card)] text-[var(--card-foreground)] shadow-sm' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}
              onClick={() => setType('income')}
            >
              Income
            </button>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Amount (₹)</label>
          <Input 
            type="number" 
            step="0.01"
            placeholder="0.00" 
            value={amount} 
            onChange={e => setAmount(e.target.value)}
            autoFocus
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Date</label>
          <Input 
            type="date" 
            value={date} 
            onChange={e => setDate(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            {type === 'income' ? 'Source / Reason' : 'Where did you spend it?'}
          </label>
          <Input 
            type="text" 
            placeholder={type === 'income' ? 'e.g. Monthly allowance' : 'e.g. College canteen'}
            value={sourceOrWhere} 
            onChange={e => setSourceOrWhere(e.target.value)}
          />
        </div>

        {type === 'expense' && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Category</label>
            <Select value={category} onChange={e => setCategory(e.target.value as Category)}>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Select>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Note (Optional)</label>
          <Input 
            type="text" 
            placeholder="Additional details..." 
            value={note} 
            onChange={e => setNote(e.target.value)}
          />
        </div>

        <div className="pt-4 flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            {editingTransaction ? 'Save Changes' : type === 'income' ? 'Add Money' : 'Add Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
