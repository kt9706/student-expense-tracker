export type PaymentMethod = 'cash' | 'debit' | 'credit' | 'upi' | 'meal_pass' | 'other';

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  color: string; // Tailwind color or hex
  budgetLimit?: number;
  isCustom?: boolean;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  categoryId: string;
  date: string; // ISO format YYYY-MM-DD
  time?: string; // HH:MM
  paymentMethod: PaymentMethod;
  notes?: string;
  tags?: string[];
  receiptUrl?: string;
  isRecurring?: boolean;
  isNecessity?: boolean; // Essential (50/30/20 budget tracking)
}

export interface CategoryBudget {
  categoryId: string;
  monthlyLimit: number;
}

export interface MonthlyBudget {
  month: string; // YYYY-MM
  totalBudget: number;
  categoryBudgets: CategoryBudget[];
  currency: string;
}

export interface StudentProfile {
  name: string;
  email: string;
  college?: string;
  avatarUrl?: string;
  monthlyAllowance: number;
  currencySymbol: string;
  currencyCode: string;
}

export interface RoommateSplit {
  id: string;
  title: string;
  totalAmount: number;
  paidBy: string;
  date: string;
  splitBetween: { name: string; share: number; paid: boolean }[];
}

export interface FilterState {
  searchQuery: string;
  categoryId: string;
  paymentMethod: string;
  startDate: string;
  endDate: string;
  minAmount: number | null;
  maxAmount: number | null;
  sortBy: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
}
