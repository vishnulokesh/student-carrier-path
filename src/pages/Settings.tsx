import React, { useEffect, useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Moon, Sun, Monitor, AlertCircle, Database } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

export const Settings: React.FC = () => {
  const { resetData, initialBalance, setInitialBalance } = useExpense();
  
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [editBalance, setEditBalance] = useState(initialBalance.toString());

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const handleSaveBalance = () => {
    const parsed = parseFloat(editBalance);
    if (!isNaN(parsed) && parsed >= 0) {
      setInitialBalance(parsed);
      alert('Starting balance updated.');
    }
  };

  const handleReset = () => {
    if (confirm('Are you absolutely sure? This will delete all your transactions and budget settings. This action cannot be undone.')) {
      resetData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-[var(--muted-foreground)]">Manage your app preferences and data.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how the app looks.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              variant={theme === 'light' ? 'default' : 'outline'} 
              onClick={() => handleThemeChange('light')}
              className="flex-1 gap-2"
            >
              <Sun className="h-4 w-4" /> Light
            </Button>
            <Button 
              variant={theme === 'dark' ? 'default' : 'outline'} 
              onClick={() => handleThemeChange('dark')}
              className="flex-1 gap-2"
            >
              <Moon className="h-4 w-4" /> Dark
            </Button>
            <Button 
              variant={theme === 'system' ? 'default' : 'outline'} 
              onClick={() => handleThemeChange('system')}
              className="flex-1 gap-2"
            >
              <Monitor className="h-4 w-4" /> System
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Settings</CardTitle>
          <CardDescription>Manage your starting balance.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Starting Money (Initial Balance)</label>
              <div className="flex gap-3 max-w-md">
                <Input 
                  type="number" 
                  value={editBalance} 
                  onChange={(e) => setEditBalance(e.target.value)} 
                />
                <Button onClick={handleSaveBalance}>Update</Button>
              </div>
              <p className="text-xs text-[var(--muted-foreground)]">
                Current starting balance is {formatCurrency(initialBalance)}. This is the amount you had before adding any transactions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200 dark:border-red-900/50">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900/50 rounded-lg bg-red-50 dark:bg-red-900/10">
            <div>
              <p className="font-semibold text-red-900 dark:text-red-200">Delete all data</p>
              <p className="text-sm text-red-700/80 dark:text-red-300/80">Clear local storage and start fresh.</p>
            </div>
            <Button variant="destructive" onClick={handleReset} className="gap-2">
              <Database className="h-4 w-4" />
              Reset App Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
