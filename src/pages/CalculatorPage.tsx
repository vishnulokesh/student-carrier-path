import React from 'react';
import { Calculator } from '../components/Calculator';

export const CalculatorPage: React.FC = () => {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calculator</h1>
        <p className="text-[var(--muted-foreground)]">Quick calculations for your expenses.</p>
      </div>

      <div className="flex-1 flex items-center justify-center pb-20">
        <Calculator />
      </div>
    </div>
  );
};
