import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useData } from '../../context/DataContext';
import { 
  Search, 
  Bell, 
  Shield, 
  ChevronDown, 
  CheckCircle2,
  AlertTriangle,
  Clock,
  Lock,
  Sparkles,
  Command,
  ExternalLink
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
  const [timeString, setTimeString] = useState('');

  // Live real-time UTC Clock for Security Ops Center (SOC) feel
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-surface/90 backdrop-blur-md border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-subtle">
      {/* Search / Command Palette shortcut with rich styling */}
      <div className="flex items-center gap-4 w-96">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between bg-slate-100/70 hover:bg-slate-100 border border-slate-200/90 text-slate-500 text-xs rounded-xl px-3.5 py-2 transition-all cursor-pointer shadow-xs group hover:border-slate-300"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-blue transition-colors" />
            <span className="text-slate-500 font-medium">Quick search pages, cases, transactions...</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 bg-white border border-slate-200 text-slate-500 font-mono text-[10px] px-1.5 py-0.5 rounded-md shadow-xs font-semibold">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </div>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Live SOC Time & Security Badge */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-mono text-slate-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <Lock className="w-3 h-3 text-slate-400" />
          <span>{timeString}</span>
        </div>

        {/* Role Switcher Pill with Smooth Glass Effect */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 bg-gradient-to-r from-navy-800 to-navy-900 hover:from-navy-900 hover:to-black text-white rounded-xl px-3.5 py-2 text-xs font-semibold transition-all shadow-sm shadow-navy-900/10"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="capitalize">Role: {currentRole}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-surface rounded-2xl border border-slate-200 shadow-elevated p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Switch Perspective</span>
                <Sparkles className="w-3 h-3 text-amber-500" />
              </div>
              <div className="mt-1 space-y-1">
                {(['customer', 'analyst', 'admin'] as UserRole[]).map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                      currentRole === r 
                        ? 'bg-navy-800 text-white font-bold shadow-xs' 
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="capitalize">{r}</p>
                      <p className={`text-[10px] ${currentRole === r ? 'text-slate-300' : 'text-slate-400'}`}>
                        {r === 'customer' ? 'Alex Johnson (User)' : r === 'analyst' ? 'David Vance (Risk Ops)' : 'Marc Lefebvre (Platform Admin)'}
                      </p>
                    </div>
                    {currentRole === r && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-all"
            title="System & Review Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-88 bg-surface rounded-2xl border border-slate-200 shadow-elevated p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-brand-blue" />
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold font-mono">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button 
                  onClick={markAllAsRead} 
                  className="text-[11px] font-semibold text-brand-blue hover:text-brand-dark transition-colors"
                >
                  Mark all read
                </button>
              </div>

              <div className="mt-2 space-y-2 max-h-72 overflow-y-auto pr-1">
                {alerts.map(a => (
                  <div key={a.id} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100 text-xs transition-colors">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span className="flex items-center gap-1.5 text-xs">
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

        {/* User Profile Avatar with Online Ring */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="relative">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 shadow-xs"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</p>
            <p className="text-[10px] text-slate-400 font-medium capitalize">{currentUser.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
