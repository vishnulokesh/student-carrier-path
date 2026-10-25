import React, { useMemo } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { formatCurrency } from '../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { isThisWeek, isThisMonth, parseISO, format } from 'date-fns';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#64748b'];

export const Analytics: React.FC = () => {
  const { transactions } = useExpense();

  const expenses = useMemo(() => transactions.filter(t => t.type === 'expense'), [transactions]);

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    expenses.forEach(t => {
      data[t.category] = (data[t.category] || 0) + t.amount;
    });
    return Object.entries(data)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const spendingThisWeek = useMemo(() => 
    expenses.filter(t => isThisWeek(parseISO(t.date))).reduce((sum, t) => sum + t.amount, 0),
  [expenses]);

  const spendingThisMonth = useMemo(() => 
    expenses.filter(t => isThisMonth(parseISO(t.date))).reduce((sum, t) => sum + t.amount, 0),
  [expenses]);

  const highestCategory = categoryData.length > 0 ? categoryData[0] : null;

  // Last 7 days data for bar chart
  const last7DaysData = useMemo(() => {
    const data: Record<string, number> = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      data[format(d, 'MMM dd')] = 0;
    }
    
    expenses.forEach(t => {
      const dateStr = format(parseISO(t.date), 'MMM dd');
      if (data[dateStr] !== undefined) {
        data[dateStr] += t.amount;
      }
    });

    return Object.entries(data).map(([date, amount]) => ({ date, amount }));
  }, [expenses]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-[var(--muted-foreground)]">Insights into your spending habits.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[var(--muted-foreground)] font-medium">Spending This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(spendingThisWeek)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[var(--muted-foreground)] font-medium">Spending This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(spendingThisMonth)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[var(--muted-foreground)] font-medium">Highest Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highestCategory ? highestCategory.name : 'N/A'}</div>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              {highestCategory ? formatCurrency(highestCategory.value) : '0'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[var(--muted-foreground)] font-medium">Avg Daily (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(spendingThisMonth / (new Date().getDate() || 1))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col h-[400px]">
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-4">
            {categoryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[var(--muted-foreground)]">
                Not enough data
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: any) => formatCurrency(Number(value))}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col h-[400px]">
          <CardHeader>
            <CardTitle>Last 7 Days Spending</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7DaysData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} dy={10} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(value) => `₹${value}`}
                  tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                />
                <RechartsTooltip
                  cursor={{ fill: 'var(--accent)' }}
                  formatter={(value: any) => formatCurrency(Number(value))}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
