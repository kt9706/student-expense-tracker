import React, { useState } from 'react';
import {
  PieChart as PieChartIcon,
  BarChart3,
  TrendingUp,
  Target,
  Zap,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { Expense, Category, StudentProfile } from '../types';
import { getMonthlySummary } from '../lib/storage';
import { CategoryIcon } from './CategoryIcon';

interface AnalyticsViewProps {
  expenses: Expense[];
  categories: Category[];
  profile: StudentProfile;
  currentYearMonth: string;
}

const COLORS = [
  '#6366f1', '#ec4899', '#3b82f6', '#10b981', '#f59e0b',
  '#8b5cf6', '#06b6d4', '#f43f5e', '#84cc16', '#64748b'
];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  expenses,
  categories,
  profile,
  currentYearMonth,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(currentYearMonth);
  const currency = profile.currencySymbol || '$';

  const summary = getMonthlySummary(expenses, categories, selectedMonth);

  // Data for Recharts Donut
  const pieData = summary.categoryBreakdown.map((item, idx) => ({
    name: item.category.name,
    value: item.spent,
    color: COLORS[idx % COLORS.length],
    icon: item.category.icon,
    percentage: item.percentage,
  }));

  // Highest single transaction
  const highestSpend = summary.monthExpenses.reduce(
    (max, e) => (e.amount > (max?.amount || 0) ? e : max),
    null as Expense | null
  );

  // 50/30/20 calculation
  const totalSpent = summary.totalSpent;
  const needsPct = totalSpent > 0 ? Math.round((summary.totalNecessities / totalSpent) * 100) : 0;
  const wantsPct = 100 - needsPct;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-slate-900 bg-slate-50">
      {/* Month Header Selector */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Analytics & Projections
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Monthly breakdown & spending trends</p>
        </div>

        <input
          type="month"
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
        />
      </div>

      {/* Top 3 Clean Minimalism Metric Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 truncate">
            Total Spent
          </p>
          <p className="text-lg sm:text-2xl font-light italic text-slate-900 truncate">
            {currency}{summary.totalSpent.toFixed(2)}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">{summary.monthExpenses.length} purchases</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 truncate">
            Daily Avg
          </p>
          <p className="text-lg sm:text-2xl font-light italic text-indigo-600 truncate">
            {currency}{summary.avgDaily.toFixed(2)}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Day 1 to {summary.daysPassed}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 truncate">
            Forecast
          </p>
          <p className="text-lg sm:text-2xl font-light italic text-purple-600 truncate">
            {currency}{summary.projectedMonthly.toFixed(0)}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">End of month est.</p>
        </div>
      </div>

      {/* Category Breakdown Donut Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-indigo-600" />
            Spending By Category
          </h3>
          <span className="text-xs text-indigo-600 font-medium">{pieData.length} Categories</span>
        </div>

        {pieData.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No spending records found for {selectedMonth}.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* Recharts Donut */}
            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${currency}${Number(value).toFixed(2)}`, 'Spent']}
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">TOTAL</span>
                <span className="text-base font-semibold text-slate-900">{currency}{summary.totalSpent.toFixed(0)}</span>
              </div>
            </div>

            {/* Category Legend list */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {pieData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-700 font-medium truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-slate-400 text-[11px] font-medium">{item.percentage.toFixed(0)}%</span>
                    <span className="font-semibold text-slate-900">{currency}{item.value.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Daily Expense Trend Bar / Area Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            Daily Spend Pattern
          </h3>
          <span className="text-xs text-slate-400 font-medium">Days 1 - {summary.daysInMonth}</span>
        </div>

        <div className="h-44 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={summary.dailyTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip
                formatter={(val: any) => [`${currency}${Number(val).toFixed(2)}`, 'Spent']}
                labelFormatter={(label) => `Day ${label}`}
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a' }}
              />
              <Area type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorAmount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Student 50/30/20 Need vs Want Gauge & Highest Expense */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Needs vs Wants */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-600" />
              Needs vs Wants (50/30)
            </h4>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-emerald-600 font-semibold">Needs: {needsPct}% ({currency}{summary.totalNecessities.toFixed(0)})</span>
              <span className="text-purple-600 font-semibold">Wants: {wantsPct}% ({currency}{summary.totalWants.toFixed(0)})</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden flex">
              <div className="h-full bg-emerald-500 transition-all" style={{ width: `${needsPct}%` }} />
              <div className="h-full bg-purple-500 transition-all" style={{ width: `${wantsPct}%` }} />
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            Aim for ~50% essentials (tuition, rent, groceries) and 30% personal wants.
          </p>
        </div>

        {/* Highest Spend Highlight */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <span className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            Highest Single Expense
          </span>
          {highestSpend ? (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-900">{highestSpend.title}</p>
                <p className="text-[10px] text-slate-400">{highestSpend.date} • {highestSpend.paymentMethod}</p>
              </div>
              <span className="text-sm font-bold text-amber-600">
                {currency}{highestSpend.amount.toFixed(2)}
              </span>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No transactions recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
