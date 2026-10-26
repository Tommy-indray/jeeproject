import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { CommandPalette } from './CommandPalette';
import { useNotification } from '../../context/NotificationContext';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export const Layout: React.FC = () => {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const { toasts, removeToast } = useNotification();

  return (
    <div className="flex min-h-screen bg-page">
      {/* 240px Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />

      {/* Toast Notifications Floater */}
      <div className="fixed bottom-5 right-5 z-50 space-y-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map(t => {
          let icon = <Info className="w-4 h-4 text-blue-500" />;
          let border = 'border-blue-200 bg-blue-50/90 text-blue-900';

          if (t.type === 'success') {
            icon = <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            border = 'border-emerald-200 bg-white text-slate-800';
          } else if (t.type === 'warning') {
            icon = <AlertTriangle className="w-4 h-4 text-amber-500" />;
            border = 'border-amber-200 bg-white text-slate-800';
          } else if (t.type === 'error') {
            icon = <XCircle className="w-4 h-4 text-rose-500" />;
            border = 'border-rose-200 bg-white text-slate-800';
          }

          return (
            <div
              key={t.id}
              className={`pointer-events-auto p-3.5 rounded-card border shadow-elevated flex items-start justify-between gap-3 animate-in slide-in-from-bottom-3 duration-200 ${border}`}
            >
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5">{icon}</span>
                <div>
                  <p className="text-xs font-semibold text-slate-900">{t.title}</p>
                  {t.message && (
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{t.message}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

