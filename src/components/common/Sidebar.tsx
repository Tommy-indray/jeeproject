import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  Sparkles,
  ChevronRight,
  Radio
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentRole, currentUser, logout } = useAuth();
  const { cases } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  const pendingCount = cases.filter(c => c.status === 'PENDING').length;

  // Helper to ensure strictly ONE tab is active at any time
  const isTabActive = (path: string, exact: boolean = true) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-navy-900 text-slate-300 flex flex-col justify-between h-screen sticky top-0 border-r border-navy-800/90 flex-shrink-0 select-none shadow-elevated z-40">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Brand Header with Glowing Shield */}
        <div className="h-16 flex items-center px-5 border-b border-navy-800/80 gap-3 bg-navy-900/60 backdrop-blur-md sticky top-0 z-10">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-blue to-blue-400 flex items-center justify-center text-white shadow-md shadow-brand-blue/20">
              <Shield className="w-5 h-5 fill-white/20" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-navy-900 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold tracking-wider text-white">VIGILIA</h1>
              <span className="text-[10px] bg-brand-blue/30 text-blue-300 px-1.5 py-0.2 rounded font-mono font-bold">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Smart Fraud Intelligence</p>
          </div>
        </div>

        {/* Role Navigation section */}
        <div className="px-3 py-4 space-y-5">
          {/* Active Workspace Header Badge */}
          <div className="px-3 py-2 rounded-xl bg-navy-800/50 border border-navy-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                {currentRole} Workspace
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">LIVE</span>
          </div>

          <nav className="space-y-1">
            {/* ================= Customer Navigation ================= */}
            {currentRole === 'customer' && (
              <>
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Cardholder Services
                </p>
                <SidebarItem 
                  to="/customer" 
                  icon={<Home className="w-4 h-4" />} 
                  label="Overview & Protection" 
                  active={isTabActive('/customer')}
                />
                <SidebarItem 
                  to="/customer/transactions" 
                  icon={<CreditCard className="w-4 h-4" />} 
                  label="Transaction History" 
                  active={isTabActive('/customer/transactions')}
                />
                <SidebarItem 
                  to="/customer/checkout" 
                  icon={<ShoppingCart className="w-4 h-4" />} 
                  label="New Checkout (Demo)" 
                  highlight
                  active={isTabActive('/customer/checkout')}
                />
                <SidebarItem 
                  to="/customer/insights" 
                  icon={<PieChart className="w-4 h-4" />} 
                  label="Spending Analytics" 
                  active={isTabActive('/customer/insights')}
                />
              </>
            )}

            {/* ================= Analyst Navigation ================= */}
            {currentRole === 'analyst' && (
              <>
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Adjudication Workspace
                </p>
                <SidebarItem 
                  to="/analyst/queue" 
                  icon={<Inbox className="w-4 h-4" />} 
                  label="Investigation Queue" 
                  badge={pendingCount > 0 ? `${pendingCount}` : undefined}
                  active={isTabActive('/analyst/queue')}
                />
                <SidebarItem 
                  to="/analyst/cases/CASE-2026-081" 
                  icon={<FileSearch className="w-4 h-4" />} 
                  label="Case Workspace (3-Zone)" 
                  active={location.pathname === '/analyst/cases/CASE-2026-081'}
                />
                <SidebarItem 
                  to="/analyst/cases/CASE-2026-081/explanation" 
                  icon={<Cpu className="w-4 h-4" />} 
                  label="SHAP Explainability" 
                  active={isTabActive('/analyst/cases/CASE-2026-081/explanation')}
                />
                <SidebarItem 
                  to="/analyst/cases/CASE-2026-081/similar" 
                  icon={<GitFork className="w-4 h-4" />} 
                  label="Similar Cases & UMAP" 
                  active={isTabActive('/analyst/cases/CASE-2026-081/similar')}
                />
                <SidebarItem 
                  to="/analyst/cases/CASE-2026-081/timeline" 
                  icon={<History className="w-4 h-4" />} 
                  label="Case Forensic Timeline" 
                  active={isTabActive('/analyst/cases/CASE-2026-081/timeline')}
                />

                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-4 mb-1">
                  Team Performance
                </p>
                <SidebarItem 
                  to="/analyst/analytics" 
                  icon={<BarChart3 className="w-4 h-4" />} 
                  label="Analyst Analytics & AHT" 
                  active={isTabActive('/analyst/analytics')}
                />
              </>
            )}

            {/* ================= Admin Navigation ================= */}
            {currentRole === 'admin' && (
              <>
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Platform Operations
                </p>
                <SidebarItem 
                  to="/admin/operations" 
                  icon={<Activity className="w-4 h-4" />} 
                  label="Operations Overview" 
                  active={isTabActive('/admin/operations')}
                />
                <SidebarItem 
                  to="/admin/services" 
                  icon={<Server className="w-4 h-4" />} 
                  label="Microservices & Chaos" 
                  active={isTabActive('/admin/services')}
                />
                <SidebarItem 
                  to="/admin/models" 
                  icon={<Cpu className="w-4 h-4" />} 
                  label="Model Registry & Drift" 
                  active={isTabActive('/admin/models')}
                />

                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-4 mb-1">
                  Governance & Tests
                </p>
                <SidebarItem 
                  to="/admin/simulator" 
                  icon={<Sliders className="w-4 h-4" />} 
                  label="Risk Policy Simulator" 
                  active={isTabActive('/admin/simulator')}
                />
                <SidebarItem 
                  to="/admin/traces" 
                  icon={<GitBranch className="w-4 h-4" />} 
                  label="Trace Explorer" 
                  active={isTabActive('/admin/traces')}
                />
                <SidebarItem 
                  to="/admin/audit" 
                  icon={<ScrollText className="w-4 h-4" />} 
                  label="Audit & Compliance Logs" 
                  active={isTabActive('/admin/audit')}
                />
                <SidebarItem 
                  to="/admin/traffic" 
                  icon={<Zap className="w-4 h-4" />} 
                  label="Traffic & Overload Tests" 
                  highlight
                  active={isTabActive('/admin/traffic')}
                />
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Footer Info & Telemetry Ticker */}
      <div className="p-3 border-t border-navy-800/80 bg-navy-950/40 space-y-2.5">
        {/* Subtle Live SLA Telemetry Pill */}
        <div className="px-3 py-1.5 rounded-lg bg-navy-900/90 border border-navy-800 flex items-center justify-between text-[10px]">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            Cluster Health
          </span>
          <span className="font-mono font-semibold text-emerald-400">99.98% SLA</span>
        </div>

        {/* User Profile Card */}
        <div className="bg-navy-800/70 hover:bg-navy-800 border border-navy-700/50 rounded-xl p-2.5 flex items-center justify-between transition-colors">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative">
              <img 
                src={currentUser.avatarUrl} 
                alt={currentUser.name} 
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-400"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-navy-900" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 capitalize truncate">{currentUser.role}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-navy-700/50 transition-colors"
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
  active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  to, 
  icon, 
  label, 
  badge, 
  highlight, 
  active 
}) => {
  return (
    <NavLink
      to={to}
      end
      className={`
        relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all duration-200 group
        ${active 
          ? 'bg-gradient-to-r from-brand-blue to-blue-600 text-white font-semibold shadow-md shadow-brand-blue/30' 
          : 'text-slate-300 hover:bg-navy-800/70 hover:text-white font-medium'
        }
      `}
    >
      {/* Illuminated left indicator bar strictly for the single active tab */}
      {active && (
        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-white rounded-r-full shadow-[0_0_8px_#FFFFFF]" />
      )}

      <div className="flex items-center gap-2.5 truncate pl-1">
        <span className={`transition-transform duration-200 ${active ? 'scale-110 text-white' : 'group-hover:scale-105 text-slate-400 group-hover:text-white'}`}>
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </div>

      <div className="flex items-center gap-1.5">
        {badge && (
          <span className="bg-rose-500 text-white font-mono text-[10px] px-2 py-0.2 rounded-full font-bold shadow-sm animate-pulse">
            {badge}
          </span>
        )}
        {highlight && !badge && !active && (
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        )}
        {active && (
          <ChevronRight className="w-3.5 h-3.5 text-white/80" />
        )}
      </div>
    </NavLink>
  );
};
