import React, { useState } from 'react';
import {
  Wallet,
  Users,
  Plus,
  CheckCircle,
  XCircle,
  DollarSign,
  Save,
  Check,
  Percent,
  Sliders
} from 'lucide-react';
import { Category, StudentProfile, RoommateSplit } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface BudgetViewProps {
  categories: Category[];
  profile: StudentProfile;
  splits: RoommateSplit[];
  onSaveProfile: (profile: StudentProfile) => void;
  onSaveCategories: (categories: Category[]) => void;
  onSaveSplits: (splits: RoommateSplit[]) => void;
}

export const BudgetView: React.FC<BudgetViewProps> = ({
  categories,
  profile,
  splits,
  onSaveProfile,
  onSaveCategories,
  onSaveSplits,
}) => {
  const [allowance, setAllowance] = useState(profile.monthlyAllowance.toString());
  const [currencySymbol, setCurrencySymbol] = useState(profile.currencySymbol);
  const [categoryLimits, setCategoryLimits] = useState<{ [id: string]: string }>(
    Object.fromEntries(categories.map(c => [c.id, (c.budgetLimit || 100).toString()]))
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Roommate Split state
  const [showAddSplit, setShowAddSplit] = useState(false);
  const [splitTitle, setSplitTitle] = useState('');
  const [splitAmount, setSplitAmount] = useState('');
  const [splitRoommates, setSplitRoommates] = useState(['Alex', 'Jordan', 'Sam']);

  const handleSaveBudgetPlan = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAllowance = parseFloat(allowance) || 850;

    // Update Profile
    onSaveProfile({
      ...profile,
      monthlyAllowance: parsedAllowance,
      currencySymbol,
    });

    // Update Categories
    const updatedCategories = categories.map(c => ({
      ...c,
      budgetLimit: parseFloat(categoryLimits[c.id] || '0') || c.budgetLimit || 50,
    }));
    onSaveCategories(updatedCategories);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAddRoommateSplit = (e: React.FormEvent) => {
    e.preventDefault();
    const tot = parseFloat(splitAmount);
    if (!splitTitle || isNaN(tot) || tot <= 0) return;

    const perPerson = tot / splitRoommates.length;
    const newSplit: RoommateSplit = {
      id: `split-${Date.now()}`,
      title: splitTitle,
      totalAmount: tot,
      paidBy: profile.name.split(' ')[0],
      date: new Date().toISOString().slice(0, 10),
      splitBetween: splitRoommates.map((name, i) => ({
        name,
        share: Number(perPerson.toFixed(2)),
        paid: i === 0, // Creator paid
      })),
    };

    onSaveSplits([newSplit, ...splits]);
    setSplitTitle('');
    setSplitAmount('');
    setShowAddSplit(false);
  };

  const handleToggleRoommatePaid = (splitId: string, roommateName: string) => {
    const updated = splits.map(s => {
      if (s.id !== splitId) return s;
      return {
        ...s,
        splitBetween: s.splitBetween.map(sb => {
          if (sb.name === roommateName) {
            return { ...sb, paid: !sb.paid };
          }
          return sb;
        }),
      };
    });
    onSaveSplits(updated);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-slate-900 bg-slate-50">
      {/* Monthly Allowance & Plan Header */}
      <div className="pt-2">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-600" />
          Budget Limits & Roommate Splitter
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Configure monthly targets & dorm expenses</p>
      </div>

      {/* Budget Plan Form */}
      <form onSubmit={handleSaveBudgetPlan} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider">Monthly Student Budget</h3>
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Saved!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Monthly Allowance / Target</label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-indigo-600">{currencySymbol}</span>
              <input
                type="number"
                value={allowance}
                onChange={e => setAllowance(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Currency Symbol</label>
            <select
              value={currencySymbol}
              onChange={e => setCurrencySymbol(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="$">$ (USD / CAD / AUD)</option>
              <option value="€">€ (EUR)</option>
              <option value="£">£ (GBP)</option>
              <option value="₹">₹ (INR)</option>
              <option value="¥">¥ (JPY / CNY)</option>
            </select>
          </div>
        </div>

        {/* Category Budget Limits */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-medium text-slate-500 block">Category Monthly Limits ({currencySymbol})</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {categories.map(cat => (
              <div key={cat.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs truncate">
                  <span className={`w-2.5 h-2.5 rounded-full ${cat.color || 'bg-indigo-500'}`} />
                  <span className="truncate font-medium text-slate-800">{cat.name}</span>
                </div>
                <input
                  type="number"
                  value={categoryLimits[cat.id] || ''}
                  onChange={e => setCategoryLimits({ ...categoryLimits, [cat.id]: e.target.value })}
                  className="w-20 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-right text-xs font-semibold text-indigo-700 shadow-2xs"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition flex items-center justify-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Budget Settings</span>
        </button>
      </form>

      {/* Roommate Expense Splitter Module */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600" />
            <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider">Roommate Bill Splitter</h3>
          </div>
          <button
            onClick={() => setShowAddSplit(!showAddSplit)}
            className="flex items-center gap-1 text-xs font-semibold text-purple-600 hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Split Bill</span>
          </button>
        </div>

        {/* Add Split Form */}
        {showAddSplit && (
          <form onSubmit={handleAddRoommateSplit} className="p-3.5 rounded-xl bg-slate-50 border border-purple-200 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Bill title (e.g. Wi-Fi, Grocery)"
                value={splitTitle}
                onChange={e => setSplitTitle(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-medium"
              />
              <input
                type="number"
                step="0.01"
                placeholder={`Total ${currencySymbol}`}
                value={splitAmount}
                onChange={e => setSplitAmount(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition"
            >
              Calculate Equal Split
            </button>
          </form>
        )}

        {/* Split Cards */}
        <div className="space-y-2.5">
          {splits.map(split => (
            <div key={split.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">{split.title}</h4>
                  <p className="text-[10px] text-slate-400">Paid by {split.paidBy} on {split.date}</p>
                </div>
                <span className="text-sm font-semibold text-purple-700">
                  {currencySymbol}{split.totalAmount.toFixed(2)}
                </span>
              </div>

              {/* Roommates Checklist */}
              <div className="flex items-center gap-2 pt-1 overflow-x-auto">
                {split.splitBetween.map((person, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToggleRoommatePaid(split.id, person.name)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-medium border transition ${
                      person.paid
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-rose-50 border-rose-200 text-rose-700'
                    }`}
                  >
                    {person.paid ? <CheckCircle className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-rose-600" />}
                    <span>{person.name}: {currencySymbol}{person.share.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
