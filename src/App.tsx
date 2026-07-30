import React, { useState, useEffect } from 'react';
import {
  getStoredExpenses,
  saveExpenses,
  getStoredCategories,
  saveCategories,
  getStoredProfile,
  saveProfile,
  getStoredSplits,
  saveSplits
} from './lib/storage';
import { Expense, Category, StudentProfile, RoommateSplit } from './types';
import { MobileFrame } from './components/MobileFrame';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { AnalyticsView } from './components/AnalyticsView';
import { TransactionsView } from './components/TransactionsView';
import { BudgetView } from './components/BudgetView';
import { QuickAddModal } from './components/QuickAddModal';
import { FirebaseAuthModal } from './components/FirebaseAuthModal';

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [profile, setProfile] = useState<StudentProfile>(getStoredProfile());
  const [splits, setSplits] = useState<RoommateSplit[]>([]);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileView, setIsMobileView] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);

  // Initial Load
  useEffect(() => {
    setExpenses(getStoredExpenses());
    setCategories(getStoredCategories());
    setProfile(getStoredProfile());
    setSplits(getStoredSplits());
  }, []);

  // Save changes
  const handleAddExpense = (newExp: Omit<Expense, 'id'>) => {
    const created: Expense = {
      ...newExp,
      id: `exp-${Date.now()}`,
    };
    const updated = [created, ...expenses];
    setExpenses(updated);
    saveExpenses(updated);
  };

  const handleDeleteExpense = (id: string) => {
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    saveExpenses(updated);
  };

  const handleSaveProfile = (updatedProfile: StudentProfile) => {
    setProfile(updatedProfile);
    saveProfile(updatedProfile);
  };

  const handleSaveCategories = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
  };

  const handleSaveSplits = (updatedSplits: RoommateSplit[]) => {
    setSplits(updatedSplits);
    saveSplits(updatedSplits);
  };

  const currentYearMonth = new Date().toISOString().slice(0, 7);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'analytics':
        return 'Monthly Summary';
      case 'transactions':
        return 'Expense Records';
      case 'budget':
        return 'Budget & Splits';
      case 'dashboard':
      default:
        return 'Daily Overview';
    }
  };

  return (
    <MobileFrame
      isMobileView={isMobileView}
      onToggleView={() => setIsMobileView(!isMobileView)}
      activeTabTitle={getTabTitle()}
    >
      <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
        {/* Top Navbar Header */}
        <Navbar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
          profile={profile}
        />

        {/* Dynamic Tab Views */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {activeTab === 'dashboard' && (
            <DashboardView
              expenses={expenses}
              categories={categories}
              profile={profile}
              currentYearMonth={currentYearMonth}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onDeleteExpense={handleDeleteExpense}
              onSelectTab={setActiveTab}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              expenses={expenses}
              categories={categories}
              profile={profile}
              currentYearMonth={currentYearMonth}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsView
              expenses={expenses}
              categories={categories}
              profile={profile}
              onDeleteExpense={handleDeleteExpense}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          )}

          {activeTab === 'budget' && (
            <BudgetView
              categories={categories}
              profile={profile}
              splits={splits}
              onSaveProfile={handleSaveProfile}
              onSaveCategories={handleSaveCategories}
              onSaveSplits={handleSaveSplits}
            />
          )}
        </main>

        {/* Quick Add Expense Modal */}
        <QuickAddModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddExpense={handleAddExpense}
          categories={categories}
          currencySymbol={profile.currencySymbol || '$'}
        />

        {/* Firebase Auth & Sync Status Modal */}
        <FirebaseAuthModal
          isOpen={isFirebaseModalOpen}
          onClose={() => setIsFirebaseModalOpen(false)}
          userEmail={profile.email}
        />
      </div>
    </MobileFrame>
  );
}
