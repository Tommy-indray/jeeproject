import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  Shield, 
  Home, 
  CreditCard, 
  ShoppingCart, 
  PieChart, 
  Inbox, 
  FileSearch, 
  Cpu, 
  GitFork, 
  History, 
  BarChart3, 
  Activity, 
  Server, 
  Sliders, 
  GitBranch, 
  ScrollText, 
  Zap, 
  LogOut,
  Sparkles
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentRole, currentUser, logout } = useAuth();
  const { cases } = useData();
  const navigate = useNavigate();

  const pendingCount = cases.filter(c => c.status === 'PENDING').length;

  return (
    <aside className="w-60 bg-navy-900 text-slate-300 flex flex-col justify-between h-screen sticky top-0 border-r border-navy-800 flex-shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-5 border-b border-navy-800/80 gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-blue to-blue-400 flex items-center justify-center text-white shadow-md">
            <Shield className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide text-white flex items-center gap-1.5">
              VIGILIA
              <span className="text-[10px] bg-brand-blue/30 text-blue-300 px-1.5 py-0.2 rounded font-mono font-normal">v1.0</span>
            </h1>
            <p className="text-[11px] text-slate-400">Smart Fraud Protection</p>
          </div>
        </div>

        {/* Role Navigation section */}
        <div className="px-3 py-4">
          <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>{currentRole} Workspace</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>

          <nav className="space-y-1">
            {/* Customer Navigation */}
            {currentRole === 'customer' && (
              <>
                <SidebarItem to="/customer" icon={<Home className="w-4 h-4" />} label="Home" />
                <SidebarItem to="/customer/transactions" icon={<CreditCard className="w-4 h-4" />} label="Transactions" />
                <SidebarItem to="/customer/checkout" icon={<ShoppingCart className="w-4 h-4" />} label="New Checkout (Demo)" highlight />
                <SidebarItem to="/customer/insights" icon={<PieChart className="w-4 h-4" />} label="Spending Insights" />
              </>
            )}

            {/* Analyst Navigation */}
            {currentRole === 'analyst' && (
              <>
                <SidebarItem 
                  to="/analyst/queue" 
                  icon={<Inbox className="w-4 h-4" />} 
                  label="Investigation Queue" 
                  badge={pendingCount > 0 ? `${pendingCount}` : undefined}
                />
                <SidebarItem to="/analyst/cases/CASE-2026-081" icon={<FileSearch className="w-4 h-4" />} label="Case Workspace (3-Zone)" />
                <SidebarItem to="/analyst/cases/CASE-2026-081/explanation" icon={<Cpu className="w-4 h-4" />} label="Model Explainability" />
                <SidebarItem to="/analyst/cases/CASE-2026-081/similar" icon={<GitFork className="w-4 h-4" />} label="Similar Cases & UMAP" />
                <SidebarItem to="/analyst/cases/CASE-2026-081/timeline" icon={<History className="w-4 h-4" />} label="Case Timeline & Audit" />
                <SidebarItem to="/analyst/analytics" icon={<BarChart3 className="w-4 h-4" />} label="Analyst Analytics" />
              </>
            )}

            {/* Admin Navigation */}
            {currentRole === 'admin' && (
              <>
                <SidebarItem to="/admin/operations" icon={<Activity className="w-4 h-4" />} label="Operations Overview" />
                <SidebarItem to="/admin/services" icon={<Server className="w-4 h-4" />} label="Service Health (Topology)" />
                <SidebarItem to="/admin/models" icon={<Cpu className="w-4 h-4" />} label="Model Health & Drift" />
                <SidebarItem to="/admin/simulator" icon={<Sliders className="w-4 h-4" />} label="Threshold Simulator" />
                <SidebarItem to="/admin/traces" icon={<GitBranch className="w-4 h-4" />} label="Trace Explorer" />
                <SidebarItem to="/admin/audit" icon={<ScrollText className="w-4 h-4" />} label="Audit Explorer" />
                <SidebarItem to="/admin/traffic" icon={<Zap className="w-4 h-4" />} label="Traffic & Overload Tests" highlight />
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Footer User Info & Logout */}
      <div className="p-3 border-t border-navy-800">
        <div className="bg-navy-800/60 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img 
              src={currentUser.avatarUrl} 
              alt={currentUser.name} 
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-400"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 capitalize">{currentUser.role}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  highlight?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, badge, highlight }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group
        ${isActive 
          ? 'bg-brand-blue text-white shadow-sm font-semibold' 
          : 'text-slate-300 hover:bg-navy-800/80 hover:text-white'
        }
        ${highlight && !to.includes('active') ? 'border border-blue-500/30' : ''}
      `}
    >
      <div className="flex items-center gap-2.5 truncate">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      {badge && (
        <span className="bg-rose-500 text-white font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold">
          {badge}
        </span>
      )}
      {highlight && !badge && (
        <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
      )}
    </NavLink>
  );
};

