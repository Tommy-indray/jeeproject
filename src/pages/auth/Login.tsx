import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, ArrowRight, UserCheck, ShieldAlert, Cpu } from 'lucide-react';
import { UserRole } from '../../types/contracts';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('sarah.chen@fraud-ops.vigilia.com');
  const [password, setPassword] = useState('••••••••••••');

  const handleRoleLogin = (role: UserRole) => {
    login(role);
    if (role === 'customer') navigate('/customer');
    else if (role === 'analyst') navigate('/analyst/queue');
    else navigate('/admin/operations');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRoleLogin('analyst');
  };

  return (
    <div className="min-h-screen bg-page flex flex-col justify-center items-center p-4">
      {/* Container */}
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-blue to-navy-800 text-white flex items-center justify-center mx-auto shadow-card">
            <Shield className="w-6 h-6 fill-white/20" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Sign in to Vigilia
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Smart FinTech Fraud Detection & High-Availability MLOps
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface rounded-2xl border border-slate-200/90 shadow-elevated p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <a href="#forgot" className="text-[11px] text-brand-blue hover:underline">Forgot password?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-navy-800 hover:bg-navy-900 text-white py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              Sign In to Platform
            </button>
          </form>

          {/* Quick Demo Sign In buttons */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 text-center">
              Quick Role Demo Access
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRoleLogin('customer')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left transition-all group"
              >
                <UserCheck className="w-4 h-4 text-brand-blue mb-1" />
                <p className="text-xs font-bold text-slate-800">Customer</p>
                <p className="text-[10px] text-slate-400">Alex Johnson</p>
              </button>

              <button
                type="button"
                onClick={() => handleRoleLogin('analyst')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-left transition-all group"
              >
                <ShieldAlert className="w-4 h-4 text-amber-600 mb-1" />
                <p className="text-xs font-bold text-slate-800">Analyst</p>
                <p className="text-[10px] text-slate-400">Sarah Chen</p>
              </button>

              <button
                type="button"
                onClick={() => handleRoleLogin('admin')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-left transition-all group"
              >
                <Cpu className="w-4 h-4 text-emerald-600 mb-1" />
                <p className="text-xs font-bold text-slate-800">Admin</p>
                <p className="text-[10px] text-slate-400">Aya Benzian</p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Vigilia Enterprise FinTech Platform &bull; End-to-end TLS 1.3
        </p>
      </div>
    </div>
  );
};

