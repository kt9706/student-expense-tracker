import React, { useState } from 'react';
import {
  X,
  Plus,
  Camera,
  Check,
  Tag,
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  CreditCard,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { Category, Expense, PaymentMethod } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  categories: Category[];
  currencySymbol: string;
}

const PRESETS = [
  { title: 'Morning Coffee', amount: 4.50, categoryId: 'coffee', icon: 'Coffee', payment: 'meal_pass' as PaymentMethod },
  { title: 'Campus Lunch', amount: 11.50, categoryId: 'food', icon: 'Utensils', payment: 'meal_pass' as PaymentMethod },
  { title: 'Bus / Metro Ride', amount: 2.75, categoryId: 'transport', icon: 'Bus', payment: 'debit' as PaymentMethod },
  { title: 'Stationery / Print', amount: 5.00, categoryId: 'academics', icon: 'BookOpen', payment: 'cash' as PaymentMethod },
  { title: 'Snack / Energy Drink', amount: 3.50, categoryId: 'coffee', icon: 'ShoppingBag', payment: 'upi' as PaymentMethod },
];

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onAddExpense,
  categories,
  currencySymbol,
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().slice(0, 10);
  const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'food');
  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState(nowTimeStr);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('debit');
  const [isNecessity, setIsNecessity] = useState(true);
  const [notes, setNotes] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['#Student']);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleApplyPreset = (p: typeof PRESETS[0]) => {
    setTitle(p.title);
    setAmount(p.amount.toString());
    setCategoryId(p.categoryId);
    setPaymentMethod(p.payment);
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const formatted = tagInput.startsWith('#') ? tagInput.trim() : `#${tagInput.trim()}`;
    if (!tags.includes(formatted)) {
      setTags([...tags, formatted]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    setScanSuccess(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
      // Auto-fill extracted details
      setTitle('University Bookstore - Lab Manual');
      setAmount('24.90');
      setCategoryId('academics');
      setPaymentMethod('debit');
      setNotes('OCR Receipt Scan: Tax included, Item #49021');
      if (!tags.includes('#ReceiptScanned')) {
        setTags(prev => [...prev, '#ReceiptScanned']);
      }
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg('Please enter a valid expense amount greater than 0.');
      return;
    }

    if (!title.trim()) {
      setErrorMsg('Please enter a title for the expense.');
      return;
    }

    onAddExpense({
      title: title.trim(),
      amount: parsedAmount,
      categoryId,
      date,
      time,
      paymentMethod,
      isNecessity,
      notes: notes.trim(),
      tags,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-t-3xl sm:rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold border border-indigo-100">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Record Daily Expense</h2>
              <p className="text-xs text-slate-500 font-medium">Quick entry for student expenses</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scroll Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Presets row */}
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-2">Quick Student Presets</label>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 shrink-0 transition font-medium"
                >
                  <CategoryIcon name={p.icon} className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{p.title}</span>
                  <span className="font-semibold text-indigo-600">
                    {currencySymbol}{p.amount.toFixed(2)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Receipt OCR Scanner simulator button */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">Scan Student Receipt</p>
                <p className="text-[11px] text-slate-500 font-medium">Auto-fill merchant & total via OCR</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSimulateScan}
              disabled={isScanning}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-1 shadow-2xs disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : scanSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Scanned!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Scan</span>
                </>
              )}
            </button>
          </div>

          {/* Amount Large Input */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
            <span className="text-xs text-slate-500 font-medium block mb-1">Total Amount</span>
            <div className="flex items-center justify-center text-3xl font-light italic text-slate-900 gap-1">
              <span className="text-indigo-600 not-italic font-normal">{currencySymbol}</span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-48 bg-transparent text-center text-slate-900 focus:outline-none placeholder-slate-300 font-normal not-italic"
                autoFocus
              />
            </div>
          </div>

          {/* Expense Title */}
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1.5">Title / Merchant</label>
            <input
              type="text"
              placeholder="e.g. Campus Cafeteria, Bookstore, Uber"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
            />
          </div>

          {/* Category Select Grid */}
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1.5">Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
              {categories.map(cat => {
                const isSelected = categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium border transition ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-100 text-slate-700'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${cat.color || 'bg-indigo-500'}`} />
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Method & Necessity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1.5">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="debit">Debit Card</option>
                <option value="meal_pass">Meal Pass / Student ID</option>
                <option value="upi">UPI / Instant Pay</option>
                <option value="cash">Cash</option>
                <option value="credit">Credit Card</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1.5">Budget Type (50/30/20)</label>
              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNecessity(true)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                    isNecessity ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Essential Need
                </button>
                <button
                  type="button"
                  onClick={() => setIsNecessity(false)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                    !isNecessity ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Want / Social
                </button>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Time</label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1.5">Tags</label>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {tags.map((t, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-medium"
                >
                  {t}
                  <button type="button" onClick={() => handleRemoveTag(t)} className="hover:text-slate-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add tag (e.g. #Dorm, #Textbooks)"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-medium text-slate-700"
              >
                Add
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Notes (Optional)</label>
            <textarea
              rows={2}
              placeholder="e.g. Split with roomie, bought with student pass..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-xs transition flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Expense Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
