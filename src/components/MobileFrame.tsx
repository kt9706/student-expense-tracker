import React from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  isMobileView: boolean;
  onToggleView: () => void;
  activeTabTitle: string;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  isMobileView,
  onToggleView,
  activeTabTitle,
}) => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col items-center justify-start py-2 sm:py-6 px-2 sm:px-4 font-sans selection:bg-indigo-500/20">
      {/* Top Bar Switcher */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-3 px-4 py-2.5 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            SW
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-slate-900 leading-tight">
              StudentWallet
            </h1>
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Clean Minimalist App • {activeTabTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleView}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition border border-slate-200 shadow-xs"
            title="Toggle between Mobile Frame and Expanded View"
          >
            {isMobileView ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Expanded View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Mobile Frame</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 ease-in-out ${
          isMobileView
            ? 'max-w-[420px] bg-slate-50 rounded-[44px] border-[10px] border-slate-900 shadow-xl relative overflow-hidden my-auto flex flex-col min-h-[820px] max-h-[880px]'
            : 'max-w-5xl bg-slate-50 rounded-3xl border border-slate-200/90 shadow-lg relative overflow-hidden flex flex-col min-h-[800px]'
        }`}
      >
        {/* Simulated Mobile Status Bar (If in Mobile View) */}
        {isMobileView && (
          <div className="w-full bg-slate-50 text-slate-600 px-6 pt-3 pb-1 flex items-center justify-between text-[11px] select-none font-medium z-30 shrink-0 border-b border-slate-100">
            <span>{currentTime}</span>
            {/* Dynamic Notch */}
            <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto -mt-1 shadow-inner flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
            </div>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3 text-slate-700" />
              <Wifi className="w-3 h-3 text-slate-700" />
              <Battery className="w-3.5 h-3.5 text-slate-800" />
            </div>
          </div>
        )}

        {/* Content Container */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>

        {/* Mobile Home Indicator (Bottom Bar) */}
        {isMobileView && (
          <div className="w-full bg-slate-50 pt-1 pb-2 flex justify-center shrink-0">
            <div className="w-32 h-1 bg-slate-300 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};
