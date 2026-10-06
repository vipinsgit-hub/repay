import React, { useState, useEffect } from 'react';
import { Profile } from '../types/database';
import { X, Save, AlertCircle, Settings as SettingsIcon, Loader2, Download, Smartphone } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  profile: Profile | null;
  onClose: () => void;
  onSaveProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error: string | null }>;
  isInstallable?: boolean;
  isStandalone?: boolean;
  isIOS?: boolean;
  onPromptInstall?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  profile,
  onClose,
  onSaveProfile,
  isInstallable = false,
  isStandalone = false,
  isIOS = false,
  onPromptInstall,
}) => {
  const [name, setName] = useState<string>('');
  const [borrowedAmount, setBorrowedAmount] = useState<number>(6000);
  const [dailyPayment, setDailyPayment] = useState<number>(100);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profile && isOpen) {
      setName(profile.name || '');
      setBorrowedAmount(Number(profile.borrowed_amount) || 6000);
      setDailyPayment(Number(profile.daily_payment) || 100);
      setErrorMessage(null);
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (borrowedAmount <= 0) {
      setErrorMessage('Total borrowed amount must be greater than zero.');
      return;
    }

    if (dailyPayment <= 0) {
      setErrorMessage('Daily payment target must be greater than zero.');
      return;
    }

    setLoading(true);
    const res = await onSaveProfile({
      name: name.trim(),
      borrowed_amount: borrowedAmount,
      daily_payment: dailyPayment,
    });
    setLoading(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.error || 'Failed to update settings.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-modal w-full max-w-md overflow-hidden transform transition-all text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
              <SettingsIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Loan Settings & App
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Update loan parameters & application preferences
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* PWA Install Banner inside Settings */}
          {!isStandalone && (isInstallable || isIOS) && (
            <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/80 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-600 text-white shrink-0">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Install REPAY Application
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Add to your home screen for instant access
                    </p>
                  </div>
                </div>

                {isInstallable && onPromptInstall && (
                  <button
                    type="button"
                    onClick={onPromptInstall}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors shrink-0 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Install
                  </button>
                )}
              </div>

              {isIOS && (
                <div className="text-[11px] text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-lg border border-blue-100 dark:border-blue-900/60 flex items-start gap-2">
                  <Smartphone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>To install on iPhone/iPad:</strong> Tap <strong>Share</strong> in Safari, then select <strong>Add to Home Screen</strong>.
                  </span>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-sm text-slate-900 dark:text-white font-medium focus:border-primary-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-500 focus:ring-offset-0 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Total Borrowed Amount (₹)
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 font-medium text-sm">
                ₹
              </div>
              <input
                type="number"
                min="1"
                step="1"
                value={borrowedAmount}
                onChange={(e) => setBorrowedAmount(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-8 pr-3.5 py-2 text-sm text-slate-900 dark:text-white font-bold focus:border-primary-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-500 focus:ring-offset-0 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Daily Payment Target (₹)
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 font-medium text-sm">
                ₹
              </div>
              <input
                type="number"
                min="1"
                step="1"
                value={dailyPayment}
                onChange={(e) => setDailyPayment(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-8 pr-3.5 py-2 text-sm text-slate-900 dark:text-white font-bold focus:border-primary-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-500 focus:ring-offset-0 transition-all"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-2 px-5 rounded-xl bg-primary-600 dark:bg-blue-600 hover:bg-primary-700 dark:hover:bg-blue-500 text-white text-xs font-bold shadow-subtle transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
