import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useProfile } from '../hooks/useProfile';
import { usePayments } from '../hooks/usePayments';
import { calculateFinancials } from '../lib/calculations';
import { Header } from '../components/Header';
import { BalanceHero } from '../components/BalanceHero';
import { SummaryCards } from '../components/SummaryCards';
import { Calendar } from '../components/Calendar';
import { PaymentHistory } from '../components/PaymentHistory';
import { PaymentModal } from '../components/PaymentModal';
import { SettingsModal } from '../components/SettingsModal';
import { Payment } from '../types/database';
import { Loader2 } from 'lucide-react';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  onLogout,
  theme,
  onToggleTheme,
}) => {
  // Navigation state between Calendar and Summary views (Default: 'calendar')
  const [activeTab, setActiveTab] = useState<'calendar' | 'summary'>('calendar');

  const {
    profile,
    loading: profileLoading,
    updateProfile,
  } = useProfile(user.id);

  const {
    payments,
    loading: paymentsLoading,
    addPayment,
    updatePayment,
    deletePayment,
  } = usePayments(user.id);

  // Modal states
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | undefined>(
    undefined
  );
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const financials = calculateFinancials(profile, payments);

  const handleDayClick = (date: Date, payment?: Payment) => {
    setSelectedDate(date);
    setSelectedPayment(payment);
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedDate(null);
    setSelectedPayment(undefined);
  };

  const isLoading = profileLoading || paymentsLoading;

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex flex-col pb-12 transition-colors duration-200 overflow-x-hidden">
      {/* Header with Navigation & Theme Toggle */}
      <Header
        userName={profile?.name || null}
        userEmail={user.email}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-2 xs:px-4 sm:px-6 pt-4 sm:pt-8 w-full flex-1 space-y-6 sm:space-y-8">
        {isLoading && !profile ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <Loader2 className="w-8 h-8 text-primary-600 dark:text-blue-400 animate-spin" />
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Loading your repayment tracker...
            </p>
          </div>
        ) : activeTab === 'calendar' ? (
          /* PAGE 1: CALENDAR VIEW */
          <section aria-label="Calendar View" className="w-full">
            <div className="max-w-4xl mx-auto space-y-6">
              <Calendar
                payments={payments}
                defaultDailyPayment={financials.dailyPayment}
                onDayClick={handleDayClick}
              />
            </div>
          </section>
        ) : (
          /* PAGE 2: REPAYMENT SUMMARY VIEW */
          <section aria-label="Summary View" className="w-full space-y-6 sm:space-y-8 animate-in fade-in duration-200">
            {/* A & B. Balance Hero & Progress */}
            <div>
              <BalanceHero financials={financials} />
            </div>

            {/* C, D & E. Summary Cards (Total Borrowed, Total Paid, Daily Target) */}
            <div>
              <SummaryCards financials={financials} />
            </div>

            {/* F. Recent Payments List */}
            <div>
              <PaymentHistory
                payments={payments}
                onDeletePayment={async (id) => {
                  await deletePayment(id);
                }}
              />
            </div>
          </section>
        )}
      </main>

      {/* Payment Action Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        date={selectedDate}
        payment={selectedPayment}
        defaultDailyPayment={financials.dailyPayment}
        existingPayments={payments}
        borrowedAmount={financials.borrowedAmount}
        onClose={handleClosePaymentModal}
        onSavePayment={async (dateStr, amount) => {
          return await addPayment(dateStr, amount);
        }}
        onUpdatePayment={async (paymentId, amount) => {
          return await updatePayment(paymentId, amount);
        }}
        onDeletePayment={async (paymentId) => {
          return await deletePayment(paymentId);
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        profile={profile}
        onClose={() => setIsSettingsOpen(false)}
        onSaveProfile={updateProfile}
      />
    </div>
  );
};
