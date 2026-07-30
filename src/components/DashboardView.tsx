import React from 'react';
import {
  Wallet,
  TrendingUp,
  AlertTriangle,
  Plus,
  ArrowUpRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  Trash2,
  CreditCard,
  PieChart as PieIcon
} from 'lucide-react';
import { Expense, Category, StudentProfile } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface DashboardViewProps {
  expenses: Expense[];
  categories: Category[];
  profile: StudentProfile;
  currentYearMonth: string;
  onOpenAddModal: () => void;
  onDeleteExpense: (id: string) => void;
  onSelectTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  expenses,
  categories,
  profile,
  currentYearMonth,
  onOpenAddModal,
  onDeleteExpense,
  onSelectTab,
}) => {
  const currency = profile.currencySymbol || '$';
  const monthlyAllowance = profile.monthlyAllowance || 850;

  // Filter expenses for current month
  const currentMonthExpenses = expenses.filter(e => e.date.startsWith(currentYearMonth));
  const totalSpentMonth = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingBudget = monthlyAllowance - totalSpentMonth;
  const usedPercentage = Math.min(100, Math.round((totalSpentMonth / monthlyAllowance) * 100));

  // Today's total
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayExpenses = expenses.filter(e => e.date === todayStr);
  const totalSpentToday = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Top spending category
  const catMap = new Map<string, Category>(categories.map(c => [c.id, c]));
  const catTotals: { [key: string]: number } = {};
  currentMonthExpenses.forEach(e => {
    catTotals[e.categoryId] = (catTotals[e.categoryId] || 0) + e.amount;
  });

  let topCatId = '';
  let topCatAmount = 0;
  Object.entries(catTotals).forEach(([cid, amt]) => {
    if (amt > topCatAmount) {
      topCatAmount = amt;
      topCatId = cid;
    }
  });
  const topCategory = catMap.get(topCatId);

  // Budget status alert color
  let statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let statusText = 'Budget status healthy';
  if (usedPercentage >= 90) {
    statusColor = 'text-rose-700 bg-rose-50 border-rose-200';
    statusText = 'Critical: 90%+ monthly budget used!';
  } else if (usedPercentage >= 75) {
    statusColor = 'text-amber-700 bg-amber-50 border-amber-200';
    statusText = 'Caution: Over 75% budget spent';
  }

  // Recent 5 expenses
  const recentExpenses = [...expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-slate-900 bg-slate-50">
      {/* Header Section */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 flex items-center gap-2">
            Hey, {profile.name.split(' ')[0]} 👋
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {profile.college || 'Student'} • {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Transaction</span>
        </button>
      </div>

      {/* Main Wallet Hero Metric Card (Clean Minimalism Style) */}
      <div className="bg-indigo-600 p-6 rounded-2xl shadow-md text-white relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs font-bold text-indigo-100 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-indigo-200" />
              Current Spending
            </p>
            <p className="text-3xl font-semibold text-white">
              {currency}{totalSpentMonth.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-indigo-100 uppercase tracking-wider mb-1">
              Monthly Budget
            </p>
            <p className="text-2xl font-light italic text-white/90">
              {currency}{monthlyAllowance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs font-medium mb-1.5 text-indigo-100">
            <span>Remaining: {currency}{remainingBudget.toFixed(2)}</span>
            <span>{usedPercentage}% Used</span>
          </div>
          <div className="h-2 w-full bg-indigo-400/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${Math.min(100, usedPercentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Hero Metrics Section (3 Clean Minimalism Cards) */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 truncate">
            Remaining
          </p>
          <p className={`text-lg sm:text-2xl font-light italic truncate ${remainingBudget < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {currency}{remainingBudget.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 truncate">
            Spent Today
          </p>
          <p className="text-lg sm:text-2xl font-light italic text-slate-900 truncate">
            {currency}{totalSpentToday.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 truncate">
            Top Category
          </p>
          <p className="text-sm sm:text-base font-semibold text-slate-900 truncate mt-1">
            {topCategory ? topCategory.name : 'None'}
          </p>
          <p className="text-[11px] text-indigo-600 font-medium">
            {currency}{topCatAmount.toFixed(0)}
          </p>
        </div>
      </div>

      {/* Status Alert Banner */}
      <div className={`p-3 rounded-2xl border text-xs font-medium flex items-center justify-between shadow-2xs ${statusColor}`}>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{statusText}</span>
        </div>
        <button
          onClick={() => onSelectTab('analytics')}
          className="text-[11px] font-semibold underline underline-offset-2 hover:opacity-80 shrink-0 ml-2"
        >
          View Details &rarr;
        </button>
      </div>

      {/* Top Categories Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-slate-900 text-sm">Top Categories</h3>
          <button
            onClick={() => onSelectTab('budget')}
            className="text-xs font-medium text-indigo-600 hover:underline flex items-center gap-1"
          >
            Manage <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3.5">
          {categories.slice(0, 4).map(cat => {
            const spent = catTotals[cat.id] || 0;
            const limit = cat.budgetLimit || 100;
            const pct = Math.min(100, Math.round((spent / limit) * 100));

            return (
              <div key={cat.id} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${cat.color || 'bg-slate-400'}`} />
                    {cat.name}
                  </span>
                  <span className="text-slate-900 font-semibold">{currency}{spent.toFixed(2)}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${pct > 90 ? 'bg-rose-500' : 'bg-indigo-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Section */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-semibold text-slate-900 text-sm">Recent Activity</h3>
          <button
            onClick={() => onSelectTab('transactions')}
            className="text-xs text-indigo-600 font-medium hover:underline"
          >
            View All ({expenses.length})
          </button>
        </div>

        <div>
          {recentExpenses.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No expenses recorded yet. Tap "New Transaction" to log your first spend!
            </div>
          ) : (
            recentExpenses.map((item, idx) => {
              const cat = catMap.get(item.categoryId);
              const firstLetter = item.title ? item.title.charAt(0).toUpperCase() : 'E';

              return (
                <div
                  key={item.id}
                  className={`p-4 flex items-center justify-between hover:bg-slate-50/80 transition ${
                    idx < recentExpenses.length - 1 ? 'border-b border-slate-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 bg-slate-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200/60">
                      {firstLetter}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{item.title}</p>
                      <p className="text-xs text-slate-400 truncate">
                        {cat?.name || 'Expense'} • {item.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <p className="font-semibold text-sm text-slate-900">
                      -{currency}{item.amount.toFixed(2)}
                    </p>
                    <button
                      onClick={() => onDeleteExpense(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete expense"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};
