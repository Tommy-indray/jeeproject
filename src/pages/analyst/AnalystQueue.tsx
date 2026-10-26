import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { MetricCard } from '../../components/common/MetricCard';
import { 
  Inbox, 
  ShieldAlert, 
  Clock, 
  Search, 
  ArrowUpDown, 
  ArrowRight, 
  UserCheck, 
  Filter,
  DollarSign,
  AlertTriangle,
  TrendingDown
} from 'lucide-react';

export const AnalystQueue: React.FC = () => {
  const { cases } = useData();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [sortBy, setSortBy] = useState<'EXPECTED_LOSS' | 'SLA' | 'RISK_SCORE' | 'AMOUNT'>('EXPECTED_LOSS');

  const pendingCases = cases.filter(c => c.status !== 'RESOLVED');
  const highRiskCount = cases.filter(c => c.priority === 'HIGH' && c.status !== 'RESOLVED').length;
  const overdueCount = 1; // 1 near breach SLA

  // Filter & Sort
  const filtered = cases.filter(c => {
    const matchesSearch = 
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.transaction.customerName.toLowerCase().includes(search.toLowerCase()) ||
      c.transaction.merchant.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priorityFilter === 'ALL' || c.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  }).sort((a, b) => {
    if (sortBy === 'EXPECTED_LOSS') return b.expectedLoss - a.expectedLoss;
    if (sortBy === 'RISK_SCORE') return b.riskScore - a.riskScore;
    if (sortBy === 'AMOUNT') return b.transaction.amount - a.transaction.amount;
    return new Date(a.slaDeadline).getTime() - new Date(b.slaDeadline).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Header & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Analyst Investigation Queue</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-navy-100 text-navy-800">
              SOC TRIAGE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Prioritized inbox of transactions flagged for human adjudication via conformal prediction uncertainty boundaries.
          </p>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <MetricCard
          title="Pending Review Cases"
          value={pendingCases.length}
          subtitle="Waiting for analyst resolution"
          icon={<Inbox className="w-5 h-5 text-navy-800" />}
          badge={<span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">Live Feed</span>}
        />
        <MetricCard
          title="High Priority Flagged"
          value={highRiskCount}
          subtitle="Expected loss > $1,000"
          icon={<ShieldAlert className="w-5 h-5 text-rose-600" />}
        />
        <MetricCard
          title="Near SLA Deadline (< 15m)"
          value={overdueCount}
          subtitle="Requires immediate triage"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          badge={<span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold animate-pulse">Urgent</span>}
        />
      </div>

      {/* Search, Filter Pills & Expected Loss Sorting */}
      <div className="bg-surface rounded-2xl border border-slate-200 p-4 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-88">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Case ID, customer name, merchant..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Priority Tabs */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl text-xs font-semibold">
            {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  priorityFilter === p 
                    ? 'bg-white text-navy-800 shadow-xs font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p === 'ALL' ? 'All Priorities' : p}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none shadow-xs"
            >
              <option value="EXPECTED_LOSS">Sort: Expected Loss ($)</option>
              <option value="RISK_SCORE">Sort: ML Risk Score</option>
              <option value="AMOUNT">Sort: Transaction Amount</option>
              <option value="SLA">Sort: SLA Urgency</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-surface rounded-2xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-5">Case ID</th>
                <th className="py-3 px-5">Customer Profile</th>
                <th className="py-3 px-5">Merchant & Category</th>
                <th className="py-3 px-5">Amount</th>
                <th className="py-3 px-5">Risk & Uncertainty</th>
                <th className="py-3 px-5">Expected Loss</th>
                <th className="py-3 px-5">SLA Deadline</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Adjudication</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map(c => {
                const isOverdue = c.id === 'CASE-2026-080';

                return (
                  <tr 
                    key={c.id} 
                    onClick={() => navigate(`/analyst/cases/${c.id}`)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-5 font-mono font-bold text-navy-800">
                      {c.id}
                    </td>
                    <td className="py-3.5 px-5">
                      <p className="font-bold text-slate-900">{c.transaction.customerName}</p>
                      <p className="text-[11px] text-slate-400">{c.transaction.customerHomeLocation.city}</p>
                    </td>
                    <td className="py-3.5 px-5">
                      <p className="font-semibold text-slate-800">{c.transaction.merchant}</p>
                      <p className="text-[11px] text-slate-400">{c.transaction.category}</p>
                    </td>
                    <td className="py-3.5 px-5 font-black text-slate-900 font-mono">
                      ${c.transaction.amount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-9 text-right font-bold text-slate-900 font-mono">
                          {c.riskScore}%
                        </div>
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${c.riskScore > 70 ? 'bg-rose-500' : c.riskScore > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${c.riskScore}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-purple-600 font-bold font-mono" title="Model uncertainty interval">
                          ±{(c.uncertaintyScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-mono font-bold text-rose-700">
                      ${c.expectedLoss.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center gap-1 font-bold ${isOverdue ? 'text-rose-600 animate-pulse' : 'text-slate-500'}`}>
                        <Clock className="w-3.5 h-3.5" />
                        {isOverdue ? '5m left (Breach risk)' : '36m left'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <StatusBadge status={c.status === 'RESOLVED' ? (c.resolution?.decision || 'RESOLVED') : c.priority} size="sm" />
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/analyst/cases/${c.id}`);
                        }}
                        className="text-brand-blue hover:text-white hover:bg-brand-blue font-bold inline-flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-xl transition-all shadow-xs"
                      >
                        Investigate
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
