import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  Home, 
  Inbox, 
  FileSearch, 
  Activity, 
  Server, 
  Sliders, 
  Cpu, 
  Shield, 
  Zap,
  ArrowRight,
  X
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { switchRole } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : undefined;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const COMMANDS = [
    // Customer
    { category: 'Customer', name: 'Customer Home', path: '/customer', role: 'customer', icon: <Home className="w-4 h-4" /> },
    { category: 'Customer', name: 'Transaction History', path: '/customer/transactions', role: 'customer', icon: <Search className="w-4 h-4" /> },
    { category: 'Customer', name: 'New Checkout Demo', path: '/customer/checkout', role: 'customer', icon: <Zap className="w-4 h-4 text-amber-500" /> },
    { category: 'Customer', name: 'Spending Insights', path: '/customer/insights', role: 'customer', icon: <Activity className="w-4 h-4" /> },
    // Analyst
    { category: 'Analyst', name: 'Investigation Queue (Cases)', path: '/analyst/queue', role: 'analyst', icon: <Inbox className="w-4 h-4 text-rose-500" /> },
    { category: 'Analyst', name: 'Active Case Workspace (3-Zone)', path: '/analyst/cases/CASE-2026-081', role: 'analyst', icon: <FileSearch className="w-4 h-4" /> },
    { category: 'Analyst', name: 'SHAP Model Explainability', path: '/analyst/cases/CASE-2026-081/explanation', role: 'analyst', icon: <Cpu className="w-4 h-4" /> },
    { category: 'Analyst', name: 'Similar Cases & UMAP Projection', path: '/analyst/cases/CASE-2026-081/similar', role: 'analyst', icon: <Shield className="w-4 h-4" /> },
    { category: 'Analyst', name: 'Analyst Workload Analytics', path: '/analyst/analytics', role: 'analyst', icon: <Activity className="w-4 h-4" /> },
    // Admin
    { category: 'Admin', name: 'Operations Overview', path: '/admin/operations', role: 'admin', icon: <Activity className="w-4 h-4" /> },
    { category: 'Admin', name: 'Microservice Health & Pod Kill', path: '/admin/services', role: 'admin', icon: <Server className="w-4 h-4" /> },
    { category: 'Admin', name: 'Model Health, Drift & MLflow', path: '/admin/models', role: 'admin', icon: <Cpu className="w-4 h-4" /> },
    { category: 'Admin', name: 'Risk Threshold Simulator', path: '/admin/simulator', role: 'admin', icon: <Sliders className="w-4 h-4" /> },
    { category: 'Admin', name: 'Traffic Simulator & Overload Tests', path: '/admin/traffic', role: 'admin', icon: <Zap className="w-4 h-4 text-amber-500" /> },
    { category: 'Admin', name: 'Audit Explorer (Immutable Logs)', path: '/admin/audit', role: 'admin', icon: <Search className="w-4 h-4" /> },
  ];

  const filtered = COMMANDS.filter(cmd => 
    cmd.name.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (cmd: typeof COMMANDS[0]) => {
    switchRole(cmd.role as any);
    navigate(cmd.path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-surface rounded-2xl border border-slate-200 shadow-elevated w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type page name, case ID, or simulation..."
            className="w-full text-sm outline-none text-slate-900 placeholder:text-slate-400"
          />
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <p className="p-4 text-xs text-slate-400 text-center">No matching pages or commands found.</p>
          ) : (
            filtered.map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(cmd)}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between text-xs text-slate-700 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-lg bg-slate-100 group-hover:bg-navy-50 text-slate-600 group-hover:text-navy-800">
                    {cmd.icon}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{cmd.name}</p>
                    <p className="text-[10px] text-slate-400">Switches to {cmd.category} role</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-blue group-hover:translate-x-0.5 transition-all" />
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigation Quick-Launcher</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};

