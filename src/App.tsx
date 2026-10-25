import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ExpenseProvider, useExpense } from './context/ExpenseContext';
import { Layout } from './components/Layout';
import { SetupScreen } from './components/SetupScreen';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Analytics } from './pages/Analytics';
import { Budget } from './pages/Budget';
import { Settings } from './pages/Settings';
import { CalculatorPage } from './pages/CalculatorPage';

const AppRoutes: React.FC = () => {
  const { isSetupComplete } = useExpense();

  if (!isSetupComplete) {
    return <SetupScreen />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="budget" element={<Budget />} />
        <Route path="calculator" element={<CalculatorPage />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <ExpenseProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ExpenseProvider>
  );
}

export default App;
