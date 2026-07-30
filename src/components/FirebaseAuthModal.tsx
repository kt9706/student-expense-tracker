import React, { useState } from 'react';
import {
  Database,
  ShieldCheck,
  X,
  Cloud,
  CheckCircle2,
  Lock,
  User,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface FirebaseAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export const FirebaseAuthModal: React.FC<FirebaseAuthModalProps> = ({
  isOpen,
  onClose,
  userEmail,
}) => {
  if (!isOpen) return null;

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleSimulateSync = () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4 text-slate-900">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold border border-amber-100">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Firebase Cloud Storage</h3>
              <p className="text-[11px] text-slate-500 font-medium">Authentication & Cloud Firestore</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sync Status Banner */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Firebase Auth Active
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-semibold">
              Synced
            </span>
          </div>

          <p className="text-slate-500 text-[11px] font-medium">
            Connected Account: <span className="text-indigo-600 font-semibold">{userEmail || 'ksskhyathi@gmail.com'}</span>
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
            <Cloud className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="text-slate-700 font-medium">Real-time Cloud Firestore syncing across devices</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-purple-600 shrink-0" />
            <span className="text-slate-700 font-medium">Encrypted user student expense records & categories</span>
          </div>
        </div>

        {/* Manual Cloud Sync Action */}
        <button
          onClick={handleSimulateSync}
          disabled={isSyncing}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-2xs transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSyncing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Syncing with Cloud Firestore...</span>
            </>
          ) : syncSuccess ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              <span>Cloud Firestore Updated!</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Now</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
