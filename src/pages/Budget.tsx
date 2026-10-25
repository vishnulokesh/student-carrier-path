import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { formatCurrency } from '../lib/utils';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { isThisMonth, parseISO } from 'date-fns';

export const Budget: React.FC = () => {
  const { budget, updateBudget, transactions } = useExpense();
  
  const [isEditing, setIsEditing] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState(budget.amount.toString());
  const [isBudgetEnabled, setIsBudgetEnabled] = useState(budget.enabled);

  const handleSave = () => {
    updateBudget({
      amount: parseFloat(budgetAmount) || 0,
      enabled: isBudgetEnabled
    });
    setIsEditing(false);
  };

  const spendingThisMonth = transactions
    .filter(t => t.type === 'expense' && isThisMonth(parseISO(t.date)))
    .reduce((sum, t) => sum + t.amount, 0);

  const budgetPercentage = budget.enabled && budget.amount > 0
    ? (spendingThisMonth / budget.amount) * 100
    : 0;

  const isOverBudget = budgetPercentage >= 100;
  const isWarning = budgetPercentage >= 90 && !isOverBudget;
  const isCaution = budgetPercentage >= 70 && !isWarning && !isOverBudget;

  let statusColor = 'bg-emerald-500';
  let bgColor = 'bg-emerald-100 dark:bg-emerald-900/30';
  let textColor = 'text-emerald-700 dark:text-emerald-400';
  let Icon = CheckCircle2;
  let message = "You're well within your budget.";

  if (isOverBudget) {
    statusColor = 'bg-red-500';
    bgColor = 'bg-red-100 dark:bg-red-900/30';
    textColor = 'text-red-700 dark:text-red-400';
    Icon = AlertTriangle;
    message = "You have exceeded your monthly budget!";
  } else if (isWarning) {
    statusColor = 'bg-orange-500';
    bgColor = 'bg-orange-100 dark:bg-orange-900/30';
    textColor = 'text-orange-700 dark:text-orange-400';
    Icon = AlertTriangle;
    message = "Warning: You're very close to your budget limit.";
  } else if (isCaution) {
    statusColor = 'bg-yellow-500';
    bgColor = 'bg-yellow-100 dark:bg-yellow-900/30';
    textColor = 'text-yellow-700 dark:text-yellow-400';
    Icon = Info;
    message = "You've spent over 70% of your budget.";
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Monthly Budget</h1>
        <p className="text-[var(--muted-foreground)]">Set a budget and track your spending against it.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Budget Settings</CardTitle>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit Budget
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="enableBudget"
                  checked={isBudgetEnabled}
                  onChange={(e) => setIsBudgetEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--ring)]"
                />
                <label htmlFor="enableBudget" className="text-sm font-medium">
                  Enable Monthly Budget Tracking
                </label>
              </div>
              
              {isBudgetEnabled && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Monthly Budget Amount (₹)</label>
                  <Input 
                    type="number" 
                    value={budgetAmount} 
                    onChange={e => setBudgetAmount(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button onClick={handleSave}>Save Settings</Button>
                <Button variant="ghost" onClick={() => {
                  setIsEditing(false);
                  setBudgetAmount(budget.amount.toString());
                  setIsBudgetEnabled(budget.enabled);
                }}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${budget.enabled ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                <span className="font-medium">
                  Status: {budget.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              {budget.enabled && (
                <div>
                  <p className="text-3xl font-bold">{formatCurrency(budget.amount)}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">Current Monthly Budget</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {budget.enabled && !isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={`p-4 rounded-lg flex items-start gap-3 ${bgColor} ${textColor}`}>
              <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{message}</p>
                <p className="text-sm mt-1 opacity-90">
                  You've spent {formatCurrency(spendingThisMonth)} out of {formatCurrency(budget.amount)} this month.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>{formatCurrency(spendingThisMonth)}</span>
                <span className="text-[var(--muted-foreground)]">{formatCurrency(budget.amount)}</span>
              </div>
              <div className="h-4 w-full bg-[var(--secondary)] rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${statusColor}`}
                  style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                />
              </div>
              <div className="text-right text-xs text-[var(--muted-foreground)]">
                {budgetPercentage.toFixed(1)}% Used
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
