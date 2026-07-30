import React from 'react';
import {
  LayoutDashboard,
  PieChart,
  Receipt,
  SlidersHorizontal,
  Plus,
  Cloud,
  User,
  Smartphone
} from 'lucide-react';
import { StudentProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAddModal: () => void;
  onOpenFirebaseModal: () => void;
  profile: StudentProfile;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenAddModal,
  onOpenFirebaseModal,
  profile,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'analytics', label: 'Summary', icon: PieChart },
    { id: 'transactions', label: 'History', icon: Receipt },
    { id: 'budget', label: 'Budget', icon: SlidersHorizontal },
  ];

  return (
    <>
      {/* Top Mobile Header */}
      <div className="px-4 py-3 bg-white/90 border-b border-slate-200 backdrop-blur-md flex items-center justify-between sticky top-0 z-20 shrink-0">
        <div className="flex items-center gap-2.5">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
          />
          <div>
            <h1 className="text-xs font-semibold text-slate-900 leading-tight tracking-tight">StudentWallet</h1>
            <p className="text-[10px] text-slate-500 font-medium">October Summary • Clean Minimalist</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Firebase Sync Indicator */}
          <button
            onClick={onOpenFirebaseModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-[11px] font-medium transition shadow-2xs"
            title="Firebase Auth & Firestore Sync"
          >
            <Cloud className="w-3 h-3 text-indigo-600" />
            <span className="hidden sm:inline">Firebase</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        </div>
      </div>

      {/* Bottom App Navigation Bar */}
      <div className="bg-white/95 border-t border-slate-200/80 backdrop-blur-lg px-3 py-2 flex items-center justify-around sticky bottom-0 z-20 shrink-0 shadow-sm">
        {tabs.slice(0, 2).map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition ${
                isActive
                  ? 'text-indigo-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-indigo-600' : ''}`} />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}

        {/* Center Floating Action Button (FAB) */}
        <button
          onClick={onOpenAddModal}
          className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 hover:scale-105 active:scale-95 transition -mt-5 border-4 border-slate-50"
          title="Record Daily Expense"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {tabs.slice(2).map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition ${
                isActive
                  ? 'text-indigo-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-indigo-600' : ''}`} />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
