import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Wallet } from 'lucide-react';

export const SetupScreen: React.FC = () => {
  const { setInitialBalance, updateBudget, completeSetup, addTransaction } = useExpense();

  const [step, setStep] = useState(1);
  const [balance, setBalance] = useState('');
  const [budget, setBudget] = useState('');
  const [wantDemoData, setWantDemoData] = useState(false);

  const handleNext = () => {
    if (step === 1) {
      if (balance === '' || isNaN(parseFloat(balance)) || parseFloat(balance) < 0) {
        alert("Please enter a valid starting amount.");
        return;
      }
      setInitialBalance(parseFloat(balance));
      setStep(2);
    } else if (step === 2) {
      if (budget !== '' && !isNaN(parseFloat(budget)) && parseFloat(budget) > 0) {
        updateBudget({ amount: parseFloat(budget), enabled: true });
      }
      setStep(3);
    } else {
      if (wantDemoData) {
        seedDemoData();
      }
      completeSetup();
    }
  };

  const seedDemoData = () => {
    const today = new Date();
    const d1 = new Date(today); d1.setDate(d1.getDate() - 1);
    const d2 = new Date(today); d2.setDate(d2.getDate() - 2);
    const d3 = new Date(today); d3.setDate(d3.getDate() - 5);

    addTransaction({
      type: 'expense',
      amount: 150,
      date: today.toISOString().split('T')[0],
      sourceOrWhere: 'College Canteen',
      category: 'Food',
      note: 'Lunch'
    });
    addTransaction({
      type: 'expense',
      amount: 50,
      date: today.toISOString().split('T')[0],
      sourceOrWhere: 'Bus',
      category: 'Transport',
    });
    addTransaction({
      type: 'expense',
      amount: 800,
      date: d1.toISOString().split('T')[0],
      sourceOrWhere: 'Bookstore',
      category: 'Education',
      note: 'Notebooks'
    });
    addTransaction({
      type: 'income',
      amount: 5000,
      date: d2.toISOString().split('T')[0],
      sourceOrWhere: 'Monthly Allowance',
      category: 'Income',
    });
    addTransaction({
      type: 'expense',
      amount: 450,
      date: d3.toISOString().split('T')[0],
      sourceOrWhere: 'Movie Ticket',
      category: 'Entertainment',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <Card className="w-full max-w-md shadow-xl border-[var(--border)]">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-[var(--primary)] text-white p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
            <Wallet className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">Let's set up your money</CardTitle>
          <CardDescription>
            {step === 1 && "Start by entering what you currently have."}
            {step === 2 && "Set a goal to keep your spending in check."}
            {step === 3 && "Almost ready!"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">How much money do you currently have?</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-[var(--muted-foreground)]">₹</span>
                  <Input 
                    type="number" 
                    placeholder="e.g. 30000" 
                    className="pl-8 text-lg"
                    value={balance}
                    onChange={e => setBalance(e.target.value)}
                    autoFocus
                  />
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Don't worry, this isn't tracked as an "Added Money" transaction. It's just your starting balance.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">What is your monthly budget? (Optional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-[var(--muted-foreground)]">₹</span>
                  <Input 
                    type="number" 
                    placeholder="e.g. 10000" 
                    className="pl-8 text-lg"
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    autoFocus
                  />
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Leave empty if you don't want to track a budget.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="bg-[var(--accent)] p-4 rounded-lg flex items-start gap-3">
                <input
                  type="checkbox"
                  id="demoData"
                  checked={wantDemoData}
                  onChange={(e) => setWantDemoData(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--ring)]"
                />
                <div>
                  <label htmlFor="demoData" className="text-sm font-medium cursor-pointer">
                    Add sample transactions
                  </label>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">
                    Check this if you want to see how the dashboard looks with some dummy data. You can delete them later.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <Button variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            <Button className={step === 1 ? 'w-full' : 'flex-1'} onClick={handleNext}>
              {step === 3 ? "Go to Dashboard" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
