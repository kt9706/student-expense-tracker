import { Expense, Category, StudentProfile, RoommateSplit, FilterState } from '../types';
import { DEFAULT_CATEGORIES, DEFAULT_PROFILE, INITIAL_EXPENSES, INITIAL_ROOMMATE_SPLITS } from '../data/initialData';

const EXPENSES_KEY = 'student_tracker_expenses_v1';
const CATEGORIES_KEY = 'student_tracker_categories_v1';
const PROFILE_KEY = 'student_tracker_profile_v1';
const SPLITS_KEY = 'student_tracker_splits_v1';

export function getStoredExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem(EXPENSES_KEY);
    if (!raw) {
      localStorage.setItem(EXPENSES_KEY, JSON.stringify(INITIAL_EXPENSES));
      return INITIAL_EXPENSES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse expenses from local storage:', err);
    return INITIAL_EXPENSES;
  }
}

export function saveExpenses(expenses: Expense[]): void {
  try {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  } catch (err) {
    console.error('Failed to save expenses to local storage:', err);
  }
}

export function getStoredCategories(): Category[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (!raw) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse categories:', err);
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(categories: Category[]): void {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (err) {
    console.error('Failed to save categories:', err);
  }
}

export function getStoredProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    return JSON.parse(raw);
  } catch (err) {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile:', err);
  }
}

export function getStoredSplits(): RoommateSplit[] {
  try {
    const raw = localStorage.getItem(SPLITS_KEY);
    if (!raw) {
      localStorage.setItem(SPLITS_KEY, JSON.stringify(INITIAL_ROOMMATE_SPLITS));
      return INITIAL_ROOMMATE_SPLITS;
    }
    return JSON.parse(raw);
  } catch (err) {
    return INITIAL_ROOMMATE_SPLITS;
  }
}

export function saveSplits(splits: RoommateSplit[]): void {
  try {
    localStorage.setItem(SPLITS_KEY, JSON.stringify(splits));
  } catch (err) {
    console.error('Failed to save splits:', err);
  }
}

// Financial Analytics Helpers
export function filterExpenses(expenses: Expense[], filter: FilterState): Expense[] {
  return expenses.filter(item => {
    // Search Title or Notes or Tags
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchNotes = item.notes ? item.notes.toLowerCase().includes(q) : false;
      const matchTags = item.tags ? item.tags.some(t => t.toLowerCase().includes(q)) : false;
      if (!matchTitle && !matchNotes && !matchTags) return false;
    }

    // Category filter
    if (filter.categoryId && filter.categoryId !== 'all') {
      if (item.categoryId !== filter.categoryId) return false;
    }

    // Payment Method filter
    if (filter.paymentMethod && filter.paymentMethod !== 'all') {
      if (item.paymentMethod !== filter.paymentMethod) return false;
    }

    // Date Range
    if (filter.startDate && item.date < filter.startDate) return false;
    if (filter.endDate && item.date > filter.endDate) return false;

    // Amount Range
    if (filter.minAmount !== null && item.amount < filter.minAmount) return false;
    if (filter.maxAmount !== null && item.amount > filter.maxAmount) return false;

    return true;
  }).sort((a, b) => {
    switch (filter.sortBy) {
      case 'date-asc':
        return a.date.localeCompare(b.date);
      case 'amount-desc':
        return b.amount - a.amount;
      case 'amount-asc':
        return a.amount - b.amount;
      case 'date-desc':
      default:
        return b.date.localeCompare(a.date);
    }
  });
}

export function getMonthlySummary(expenses: Expense[], categories: Category[], yearMonth: string) {
  // yearMonth format: YYYY-MM
  const monthExpenses = expenses.filter(e => e.date.startsWith(yearMonth));
  const totalSpent = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Category Breakdown
  const categoryTotals: { [catId: string]: number } = {};
  monthExpenses.forEach(e => {
    categoryTotals[e.categoryId] = (categoryTotals[e.categoryId] || 0) + e.amount;
  });

  const categoryBreakdown = categories.map(cat => {
    const spent = categoryTotals[cat.id] || 0;
    const limit = cat.budgetLimit || 0;
    const percentage = totalSpent > 0 ? (spent / totalSpent) * 100 : 0;
    return {
      category: cat,
      spent,
      limit,
      percentage,
      isOverBudget: limit > 0 && spent > limit,
    };
  }).filter(c => c.spent > 0 || c.limit > 0);

  // Daily Breakdown for Charts
  const dailyTotals: { [dateStr: string]: number } = {};
  monthExpenses.forEach(e => {
    dailyTotals[e.date] = (dailyTotals[e.date] || 0) + e.amount;
  });

  const daysInMonth = new Date(
    parseInt(yearMonth.split('-')[0]),
    parseInt(yearMonth.split('-')[1]),
    0
  ).getDate();

  const dailyTrend = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const dayStr = String(i).padStart(2, '0');
    const fullDate = `${yearMonth}-${dayStr}`;
    dailyTrend.push({
      day: i,
      date: fullDate,
      amount: dailyTotals[fullDate] || 0,
    });
  }

  // Calculate Necessities vs Wants
  const totalNecessities = monthExpenses.filter(e => e.isNecessity).reduce((sum, e) => sum + e.amount, 0);
  const totalWants = totalSpent - totalNecessities;

  // Average Daily Spend
  const currentDayNum = new Date().getDate();
  const daysPassed = yearMonth === new Date().toISOString().slice(0, 7) ? Math.max(1, currentDayNum) : daysInMonth;
  const avgDaily = totalSpent / daysPassed;
  const projectedMonthly = avgDaily * daysInMonth;

  return {
    monthExpenses,
    totalSpent,
    categoryBreakdown,
    dailyTrend,
    totalNecessities,
    totalWants,
    avgDaily,
    projectedMonthly,
    daysPassed,
    daysInMonth,
  };
}

export function exportExpensesToCSV(expenses: Expense[], categories: Category[]): void {
  const catMap = new Map(categories.map(c => [c.id, c.name]));
  const headers = ['ID', 'Title', 'Amount', 'Category', 'Date', 'Time', 'Payment Method', 'Necessity', 'Tags', 'Notes'];
  const rows = expenses.map(e => [
    e.id,
    `"${e.title.replace(/"/g, '""')}"`,
    e.amount.toFixed(2),
    `"${catMap.get(e.categoryId) || e.categoryId}"`,
    e.date,
    e.time || '',
    e.paymentMethod,
    e.isNecessity ? 'Yes' : 'No',
    `"${(e.tags || []).join(', ')}"`,
    `"${(e.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `student_expenses_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
