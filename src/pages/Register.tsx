import React, { useState } from 'react';
import { Wallet, UserPlus, AlertCircle, Loader2, ArrowLeft, Sun, Moon } from 'lucide-react';

interface RegisterProps {
  onSignUp: (name: string, email: string, pass: string) => Promise<{ data: any; error: string | null }>;
  onSwitchToLogin: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Register: React.FC<RegisterProps> = ({
  onSignUp,
  onSwitchToLogin,
  theme,
  onToggleTheme,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const { data, error } = await onSignUp(name.trim(), email, password);
    setLoading(false);

    if (error) {
      setErrorMsg(error);
    } else if (data && !data.session && data.user) {
      setErrorMsg(
        'Account created! If email confirmation is enabled on your Supabase project, please check your inbox to confirm your account before logging in.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#0B0F17] flex items-center justify-center p-4 transition-colors duration-200 relative">
      {/* Absolute theme toggle at top right */}
      <button
        onClick={onToggleTheme}
        className="absolute top-4 right-4 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors"
        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-amber-400" />
        ) : (
          <Moon className="w-5 h-5 text-slate-600" />
        )}
      </button>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-card text-slate-900 dark:text-slate-100">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary-900 dark:bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-subtle">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create an Account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Start tracking your daily repayments effortlessly
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white font-medium focus:border-primary-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-500 focus:ring-offset-0 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white font-medium focus:border-primary-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-500 focus:ring-offset-0 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white font-medium focus:border-primary-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-500 focus:ring-offset-0 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-primary-900 dark:bg-blue-600 hover:bg-primary-800 dark:hover:bg-blue-500 text-white font-bold text-sm shadow-subtle transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Register Account
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="font-bold text-primary-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 ml-1"
            >
              <ArrowLeft className="w-3 h-3" /> Back to Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
