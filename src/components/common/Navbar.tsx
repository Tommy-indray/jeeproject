import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useData } from '../../context/DataContext';
import { 
  Search, 
  Bell, 
  Shield, 
  UserCheck, 
  Sliders, 
  ChevronDown, 
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { UserRole } from '../../types/contracts';

interface NavbarProps {
  onOpenCommandPalette: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette }) => {
  const { currentUser, currentRole, switchRole } = useAuth();
  const { alerts, unreadCount, markAllAsRead } = useNotification();
  const { cases } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const pendingCasesCount = cases.filter(c => c.status === 'PENDING').length;

  return (
    <header className="h-16 bg-surface border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-subtle">
      {/* Search / Command Palette shortcut */}
      <div className="flex items-center gap-4 w-96">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-400 text-xs rounded-lg px-3.5 py-2 transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
            <span className="text-slate-500">Quick search pages, cases, tx ID...</span>
          </div>
          <kbd className="hidden sm:inline-block bg-white border border-slate-200 text-slate-500 font-mono text-[10px] px-1.5 py-0.5 rounded shadow-sm">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 bg-navy-50 hover:bg-navy-100/80 text-navy-800 border border-navy-100 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
            <span className="capitalize">Role: {currentRole}</span>
            <ChevronDown className="w-3.5 h-3.5 text-navy-600" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-surface rounded-card border border-slate-200 shadow-elevated p-2 z-50">
              <p className="text-[11px] font-semibold uppercase text-slate-400 px-2 py-1">Switch Perspective</p>
              {(['customer', 'analyst', 'admin'] as UserRole[]).map(r => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${currentRole === r ? 'bg-navy-800 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <span className="capitalize">{r}</span>
                  {currentRole === r && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
            title="System & Review Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-surface rounded-card border border-slate-200 shadow-elevated p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-900">Notifications ({unreadCount} new)</span>
                <button 
                  onClick={markAllAsRead} 
                  className="text-[11px] text-brand-blue hover:underline"
                >
                  Mark read
                </button>
              </div>

              <div className="mt-2 space-y-2 max-h-72 overflow-y-auto">
                {alerts.map(a => (
                  <div key={a.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        {a.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">Just now</span>
                    </div>
                    <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">{a.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
          />
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-800">{currentUser.name}</p>
            <p className="text-[10px] text-slate-400 capitalize">{currentUser.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

