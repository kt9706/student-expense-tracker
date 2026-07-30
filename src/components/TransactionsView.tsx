import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Trash2,
  Calendar,
  CreditCard,
  Tag,
  ArrowUpDown,
  FileText,
  X,
  Plus
} from 'lucide-react';
import { Expense, Category, FilterState, StudentProfile } from '../types';
import { filterExpenses, exportExpensesToCSV } from '../lib/storage';
import { CategoryIcon } from './CategoryIcon';

interface TransactionsViewProps {
  expenses: Expense[];
  categories: Category[];
  profile: StudentProfile;
  onDeleteExpense: (id: string) => void;
  onOpenAddModal: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  expenses,
  categories,
  profile,
  onDeleteExpense,
  onOpenAddModal,
}) => {
  const currency = profile.currencySymbol || '$';

  const [filter, setFilter] = useState<FilterState>({
    searchQuery: '',
    categoryId: 'all',
    paymentMethod: 'all',
    startDate: '',
    endDate: '',
    minAmount: null,
    maxAmount: null,
    sortBy: 'date-desc',
  });

  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const filteredList = filterExpenses(expenses, filter);
  const totalFilteredAmount = filteredList.reduce((sum, e) => sum + e.amount, 0);

  const catMap = new Map<string, Category>(categories.map(c => [c.id, c]));

  const handleExportCSV = () => {
    exportExpensesToCSV(filteredList, categories);
  };

  const handleResetFilters = () => {
    setFilter({
      searchQuery: '',
      categoryId: 'all',
      paymentMethod: 'all',
      startDate: '',
      endDate: '',
      minAmount: null,
      maxAmount: null,
      sortBy: 'date-desc',
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-slate-900 bg-slate-50">
      {/* Top Action Header */}
      <div className="flex items-center justify-between gap-2 pt-2">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Recent Activity</h2>
          <p className="text-xs text-slate-500 font-medium">
            Showing {filteredList.length} of {expenses.length} transactions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium transition shadow-2xs"
            title="Export filtered records to CSV"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Filter Toggle */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search expense title, notes, #tag..."
            value={filter.searchQuery}
            onChange={e => setFilter({ ...filter, searchQuery: e.target.value })}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
          />
          {filter.searchQuery && (
            <button
              onClick={() => setFilter({ ...filter, searchQuery: '' })}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilterDrawer(!showFilterDrawer)}
          className={`p-2 px-3 rounded-xl border text-xs flex items-center gap-1.5 font-medium transition ${
            showFilterDrawer || filter.categoryId !== 'all' || filter.paymentMethod !== 'all'
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filter</span>
        </button>
      </div>

      {/* Filter Drawer / Accordion */}
      {showFilterDrawer && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Advanced Filters</span>
            <button
              onClick={handleResetFilters}
              className="text-xs text-indigo-600 hover:underline font-medium"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Category Select */}
            <div>
              <label className="text-[11px] font-medium text-slate-500 block mb-1">Category</label>
              <select
                value={filter.categoryId}
                onChange={e => setFilter({ ...filter, categoryId: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium"
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label className="text-[11px] font-medium text-slate-500 block mb-1">Payment Method</label>
              <select
                value={filter.paymentMethod}
                onChange={e => setFilter({ ...filter, paymentMethod: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium"
              >
                <option value="all">All Methods</option>
                <option value="debit">Debit Card</option>
                <option value="meal_pass">Meal Pass / Student ID</option>
                <option value="upi">UPI</option>
                <option value="cash">Cash</option>
                <option value="credit">Credit Card</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="text-[11px] font-medium text-slate-500 block mb-1">From Date</label>
              <input
                type="date"
                value={filter.startDate}
                onChange={e => setFilter({ ...filter, startDate: e.target.value })}
                className="w-full px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium"
              />
            </div>

            {/* Sort Order */}
            <div>
              <label className="text-[11px] font-medium text-slate-500 block mb-1">Sort By</label>
              <select
                value={filter.sortBy}
                onChange={e => setFilter({ ...filter, sortBy: e.target.value as any })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Filtered Total Banner */}
      <div className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">Filtered Total Spend:</span>
        <span className="font-semibold text-slate-900 text-sm">{currency}{totalFilteredAmount.toFixed(2)}</span>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredList.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-xs">
            No expenses matching your filter parameters.
          </div>
        ) : (
          filteredList.map((item, idx) => {
            const cat = catMap.get(item.categoryId);
            const firstLetter = item.title ? item.title.charAt(0).toUpperCase() : 'E';

            return (
              <div
                key={item.id}
                onClick={() => setSelectedExpense(item)}
                className={`p-4 flex items-center justify-between hover:bg-slate-50/80 transition cursor-pointer group ${
                  idx < filteredList.length - 1 ? 'border-b border-slate-100' : ''
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 bg-slate-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200/60">
                    {firstLetter}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{item.title}</p>
                    <p className="text-xs text-slate-400 truncate">
                      {cat?.name || 'Expense'} • {item.date} {item.time || ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <span className="text-sm font-semibold text-slate-900 block">
                      -{currency}{item.amount.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">{item.paymentMethod.replace('_', ' ')}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteExpense(item.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition opacity-0 group-hover:opacity-100"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Expense Detail Modal */}
      {selectedExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-0.5">Receipt Detail</span>
                <h3 className="text-base font-semibold text-slate-900">{selectedExpense.title}</h3>
              </div>
              <button
                onClick={() => setSelectedExpense(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center space-y-1">
              <span className="text-xs text-slate-400 font-medium">Total Amount</span>
              <div className="text-3xl font-light italic text-slate-900">
                {currency}{selectedExpense.amount.toFixed(2)}
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-semibold">
                {catMap.get(selectedExpense.categoryId)?.name || 'Category'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400">Date & Time</span>
                <span className="font-medium text-slate-800">{selectedExpense.date} {selectedExpense.time || ''}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400">Payment Method</span>
                <span className="capitalize font-medium text-slate-800">{selectedExpense.paymentMethod.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400">Classification</span>
                <span className="font-medium text-slate-800">{selectedExpense.isNecessity ? 'Essential Need (50%)' : 'Personal Want (30%)'}</span>
              </div>
              {selectedExpense.notes && (
                <div className="pt-2 border-t border-slate-100 text-slate-600">
                  <span className="text-slate-400 block mb-1 font-medium">Notes:</span>
                  <p className="bg-slate-50 p-2.5 rounded-lg text-[11px] text-slate-700 italic border border-slate-100">{selectedExpense.notes}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                onDeleteExpense(selectedExpense.id);
                setSelectedExpense(null);
              }}
              className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-semibold transition"
            >
              Delete Expense
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
