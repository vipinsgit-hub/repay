import React from 'react';
import { LogOut, Settings, Wallet, Calendar, PieChart, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  userName: string | null;
  userEmail?: string;
  activeTab: 'calendar' | 'summary';
  onTabChange: (tab: 'calendar' | 'summary') => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName,
  userEmail,
  activeTab,
  onTabChange,
  theme,
  onToggleTheme,
  onOpenSettings,
  onLogout,
}) => {
  const displayName = userName || userEmail?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary-900 dark:bg-blue-600 text-white flex items-center justify-center shadow-subtle">
            <Wallet className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            REPAY
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
            Tracker
          </span>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
          <button
            onClick={() => onTabChange('calendar')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'calendar'
                ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-blue-400 shadow-card border border-slate-200/60 dark:border-slate-700/60'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Calendar</span>
          </button>

          <button
            onClick={() => onTabChange('summary')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'summary'
                ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-blue-400 shadow-card border border-slate-200/60 dark:border-slate-700/60'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Summary</span>
          </button>
        </nav>

        {/* Right Actions & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* User profile avatar badge */}
          <div className="flex items-center gap-2 px-2 sm:px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="w-6 h-6 rounded-full bg-primary-600 dark:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center shrink-0">
              {initial}
            </div>
            <span className="hidden sm:inline-block text-xs font-medium text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
              {displayName}
            </span>
          </div>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Settings"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Logout button */}
          <button
            onClick={onLogout}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-2 justify-center">
        <div className="flex items-center gap-1 w-full max-w-sm bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => onTabChange('calendar')}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'calendar'
                ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Calendar</span>
          </button>

          <button
            onClick={() => onTabChange('summary')}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'summary'
                ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Summary</span>
          </button>
        </div>
      </div>
    </header>
  );
};
