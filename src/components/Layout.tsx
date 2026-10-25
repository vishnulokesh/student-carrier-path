import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Wallet, 
  Settings, 
  Menu,
  X,
  Calculator as CalculatorIcon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Transactions', path: '/transactions', icon: Receipt },
  { name: 'Analytics', path: '/analytics', icon: PieChart },
  { name: 'Budget', path: '/budget', icon: Wallet },
  { name: 'Calculator', path: '/calculator', icon: CalculatorIcon },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[var(--card)] border-r border-[var(--border)] text-[var(--card-foreground)]">
      <div className="p-6 flex items-center gap-3 font-bold text-xl text-[var(--primary)] border-b border-[var(--border)]">
        <div className="bg-[var(--primary)] text-white p-1.5 rounded-lg">
          <Wallet className="h-6 w-6" />
        </div>
        <span>StudentEx</span>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-[var(--primary)]/10 text-[var(--primary)]" 
                  : "text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[var(--border)] text-xs text-center text-[var(--muted-foreground)]">
        &copy; 2026 Student Expense
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[var(--background)] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 flex-shrink-0 z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex">
          <aside className="w-64 max-w-[80%] bg-[var(--card)] h-full shadow-2xl transition-transform">
            <SidebarContent />
          </aside>
          <div className="flex-1 p-4" onClick={toggleMobileMenu}>
            <Button variant="ghost" size="icon" className="text-white bg-black/20 hover:bg-black/40 rounded-full">
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="md:hidden h-16 border-b border-[var(--border)] bg-[var(--card)] flex items-center justify-between px-4 z-10 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-[var(--primary)]">
            <Wallet className="h-5 w-5" />
            <span>StudentEx</span>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            <Menu className="h-6 w-6" />
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
