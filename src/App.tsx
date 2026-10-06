import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Loader2, Wallet } from 'lucide-react';

export function App() {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#0B0F17] flex flex-col items-center justify-center p-4 transition-colors duration-200">
        <div className="w-12 h-12 rounded-xl bg-primary-900 dark:bg-blue-600 text-white flex items-center justify-center mb-4 shadow-card">
          <Wallet className="w-6 h-6 animate-pulse text-white" />
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin text-primary-600 dark:text-blue-400" />
          <span>Connecting to REPAY...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    if (authMode === 'register') {
      return (
        <Register
          onSignUp={signUp}
          onSwitchToLogin={() => setAuthMode('login')}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      );
    }
    return (
      <Login
        onSignIn={signIn}
        onSwitchToRegister={() => setAuthMode('register')}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  return (
    <Dashboard
      user={user}
      onLogout={signOut}
      theme={theme}
      onToggleTheme={toggleTheme}
    />
  );
}

export default App;
