import { Category, Expense, StudentProfile, RoommateSplit } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'food', name: 'Food & Dining', icon: 'Utensils', color: 'bg-orange-500 text-orange-500', budgetLimit: 250 },
  { id: 'academics', name: 'Textbooks & Books', icon: 'BookOpen', color: 'bg-indigo-500 text-indigo-500', budgetLimit: 150 },
  { id: 'housing', name: 'Rent & Dorm', icon: 'Home', color: 'bg-blue-500 text-blue-500', budgetLimit: 400 },
  { id: 'transport', name: 'Bus Pass & Transit', icon: 'Bus', color: 'bg-emerald-500 text-emerald-500', budgetLimit: 60 },
  { id: 'coffee', name: 'Coffee & Snacks', icon: 'Coffee', color: 'bg-amber-600 text-amber-600', budgetLimit: 50 },
  { id: 'subscriptions', name: 'Subscriptions', icon: 'Tv', color: 'bg-purple-500 text-purple-500', budgetLimit: 30 },
  { id: 'entertainment', name: 'Outing & Social', icon: 'Film', color: 'bg-pink-500 text-pink-500', budgetLimit: 80 },
  { id: 'groceries', name: 'Groceries', icon: 'ShoppingBag', color: 'bg-teal-500 text-teal-500', budgetLimit: 180 },
  { id: 'utilities', name: 'Wi-Fi & Utilities', icon: 'Zap', color: 'bg-yellow-500 text-yellow-500', budgetLimit: 45 },
  { id: 'other', name: 'Miscellaneous', icon: 'MoreHorizontal', color: 'bg-slate-500 text-slate-500', budgetLimit: 50 },
];

export const DEFAULT_PROFILE: StudentProfile = {
  name: 'Alex Rivera',
  email: 'alex.rivera@campus.edu',
  college: 'State University',
  monthlyAllowance: 850,
  currencySymbol: '$',
  currencyCode: 'USD',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
};

// Generate realistic date strings for current month (2026-07) and recent days
const today = new Date();
const currentYear = today.getFullYear();
const currentMonthStr = String(today.getMonth() + 1).padStart(2, '0');

const getDateStr = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    title: 'Data Structures Textbook',
    amount: 68.50,
    categoryId: 'academics',
    date: getDateStr(1),
    time: '14:20',
    paymentMethod: 'debit',
    notes: 'Bought used copy at Campus Bookstore',
    tags: ['#Textbooks', '#CS102'],
    isNecessity: true,
  },
  {
    id: 'exp-2',
    title: 'Iced Oat Latte & Muffin',
    amount: 6.75,
    categoryId: 'coffee',
    date: getDateStr(0),
    time: '09:15',
    paymentMethod: 'meal_pass',
    notes: 'Library Cafe study session',
    tags: ['#Coffee', '#StudyFuel'],
    isNecessity: false,
  },
  {
    id: 'exp-3',
    title: 'Monthly Bus Pass',
    amount: 45.00,
    categoryId: 'transport',
    date: getDateStr(4),
    time: '10:00',
    paymentMethod: 'debit',
    notes: 'Student discount rate with ID',
    tags: ['#Transit', '#StudentDiscount'],
    isNecessity: true,
  },
  {
    id: 'exp-4',
    title: 'Trader Joe Groceries',
    amount: 54.20,
    categoryId: 'groceries',
    date: getDateStr(2),
    time: '17:45',
    paymentMethod: 'debit',
    notes: 'Eggs, milk, ramen, pasta, apples',
    tags: ['#Groceries', '#MealPrep'],
    isNecessity: true,
  },
  {
    id: 'exp-5',
    title: 'Campus Dining Hall Buffet',
    amount: 12.00,
    categoryId: 'food',
    date: getDateStr(3),
    time: '12:30',
    paymentMethod: 'meal_pass',
    notes: 'Lunch with study group',
    tags: ['#Lunch', '#CampusFood'],
    isNecessity: true,
  },
  {
    id: 'exp-6',
    title: 'Spotify Student Plan',
    amount: 5.99,
    categoryId: 'subscriptions',
    date: getDateStr(6),
    time: '08:00',
    paymentMethod: 'credit',
    notes: 'Includes Hulu student bundle',
    tags: ['#Music', '#Monthly'],
    isRecurring: true,
    isNecessity: false,
  },
  {
    id: 'exp-7',
    title: 'Friday Night Movie & Popcorn',
    amount: 18.50,
    categoryId: 'entertainment',
    date: getDateStr(5),
    time: '20:15',
    paymentMethod: 'debit',
    notes: 'AMC Student Ticket Night',
    tags: ['#Weekend', '#Friends'],
    isNecessity: false,
  },
  {
    id: 'exp-8',
    title: 'High-speed Dorm Wi-Fi Share',
    amount: 22.50,
    categoryId: 'utilities',
    date: getDateStr(7),
    time: '11:00',
    paymentMethod: 'upi',
    notes: 'Paid my half to roommate Mark',
    tags: ['#Utilities', '#Internet'],
    isNecessity: true,
  },
  {
    id: 'exp-9',
    title: 'Late Night Ramen Spot',
    amount: 14.80,
    categoryId: 'food',
    date: getDateStr(8),
    time: '23:10',
    paymentMethod: 'cash',
    notes: 'Post-midterm celebration',
    tags: ['#Food', '#LateNight'],
    isNecessity: false,
  },
  {
    id: 'exp-10',
    title: 'Lab Notebook & Highlighters',
    amount: 11.25,
    categoryId: 'academics',
    date: getDateStr(10),
    time: '15:30',
    paymentMethod: 'debit',
    notes: 'Chemistry supplies',
    tags: ['#Stationery'],
    isNecessity: true,
  }
];

export const INITIAL_ROOMMATE_SPLITS: RoommateSplit[] = [
  {
    id: 'split-1',
    title: 'Dorm Cleaning Supplies & Paper Towels',
    totalAmount: 36.00,
    paidBy: 'Alex',
    date: getDateStr(3),
    splitBetween: [
      { name: 'Alex', share: 12.00, paid: true },
      { name: 'Jordan', share: 12.00, paid: true },
      { name: 'Sam', share: 12.00, paid: false },
    ],
  },
  {
    id: 'split-2',
    title: 'Weekend Groceries (Costco)',
    totalAmount: 90.00,
    paidBy: 'Jordan',
    date: getDateStr(6),
    splitBetween: [
      { name: 'Alex', share: 30.00, paid: true },
      { name: 'Jordan', share: 30.00, paid: true },
      { name: 'Sam', share: 30.00, paid: false },
    ],
  }
];
