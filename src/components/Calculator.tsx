import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Delete } from 'lucide-react';

export const Calculator: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleInput = (val: string) => {
    setExpression((prev) => prev + val);
    setResult(null);
  };

  const handleClear = () => {
    setExpression('');
    setResult(null);
  };

  const handleDelete = () => {
    setExpression((prev) => prev.slice(0, -1));
    setResult(null);
  };

  const calculate = () => {
    try {
      if (!expression) return;
      // Basic validation to prevent arbitrary code execution
      if (!/^[\d+\-*/.() ]+$/.test(expression)) {
        setResult('Error');
        return;
      }
      // Safe eval equivalent
      const evalResult = new Function('return ' + expression)();
      if (typeof evalResult === 'number' && !isNaN(evalResult)) {
        setResult(evalResult.toString());
      } else {
        setResult('Error');
      }
    } catch {
      setResult('Error');
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-[var(--muted-foreground)]">Quick Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-[var(--accent)] p-4 rounded-lg mb-4 text-right overflow-hidden flex flex-col justify-center min-h-[5rem]">
          <div className="text-[var(--muted-foreground)] text-sm h-5 tracking-wider">
            {expression || '0'}
          </div>
          <div className="text-3xl font-bold tracking-tight text-[var(--foreground)] h-9">
            {result !== null ? `= ${result}` : ''}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <Button variant="secondary" onClick={handleClear} className="text-red-500 font-bold">C</Button>
          <Button variant="secondary" onClick={() => handleInput('(')}>(</Button>
          <Button variant="secondary" onClick={() => handleInput(')')}>)</Button>
          <Button variant="secondary" onClick={handleDelete} className="text-orange-500"><Delete className="h-4 w-4" /></Button>

          <Button variant="outline" onClick={() => handleInput('7')}>7</Button>
          <Button variant="outline" onClick={() => handleInput('8')}>8</Button>
          <Button variant="outline" onClick={() => handleInput('9')}>9</Button>
          <Button variant="secondary" onClick={() => handleInput('/')} className="text-[var(--primary)] font-bold">÷</Button>

          <Button variant="outline" onClick={() => handleInput('4')}>4</Button>
          <Button variant="outline" onClick={() => handleInput('5')}>5</Button>
          <Button variant="outline" onClick={() => handleInput('6')}>6</Button>
          <Button variant="secondary" onClick={() => handleInput('*')} className="text-[var(--primary)] font-bold">×</Button>

          <Button variant="outline" onClick={() => handleInput('1')}>1</Button>
          <Button variant="outline" onClick={() => handleInput('2')}>2</Button>
          <Button variant="outline" onClick={() => handleInput('3')}>3</Button>
          <Button variant="secondary" onClick={() => handleInput('-')} className="text-[var(--primary)] font-bold">−</Button>

          <Button variant="outline" onClick={() => handleInput('0')}>0</Button>
          <Button variant="outline" onClick={() => handleInput('.')}>.</Button>
          <Button className="col-span-1 bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 font-bold" onClick={calculate}>=</Button>
          <Button variant="secondary" onClick={() => handleInput('+')} className="text-[var(--primary)] font-bold">+</Button>
        </div>
      </CardContent>
    </Card>
  );
};
