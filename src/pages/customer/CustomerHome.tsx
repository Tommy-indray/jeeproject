import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  ShieldCheck, 
  CreditCard, 
  Clock, 
  ShieldAlert, 
  ArrowRight, 
  PlusCircle, 
  ShoppingBag,
  Sparkles,
  Lock,
  Zap,
  ShieldQuestion
} from 'lucide-react';

export const CustomerHome: React.FC = () => {
  const { currentUser } = useAuth();
  const { transactions } = useData();
  const navigate = useNavigate();

  const checkedCount = transactions.length + 138;
  const heldCount = transactions.filter(t => t.status === 'PENDING_REVIEW').length;
  const declinedCount = transactions.filter(t => t.status === 'REJECTED').length;

  return (
    <div className="space-y-6">
      {/* Protection Status Banner with Glowing Radar Shield */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-900 via-navy-800 to-blue-950 p-7 text-white shadow-card border border-navy-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Decorative background blur glow */}
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-brand-blue/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5 relative z-10">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/30 to-emerald-400/10 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-navy-900 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold tracking-tight">Protected by Vigilia</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono tracking-wider">
                ACTIVE SHIELD
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Hello, <strong>{currentUser.name}</strong>. Your account is continuously supervised with intelligent anomaly detection, sub-15ms ML authorization, and zero-liability fraud coverage.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto relative z-10">
          <button
            onClick={() => navigate('/customer/checkout')}
            className="w-full md:w-auto bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-brand-blue/30"
          >
            <PlusCircle className="w-4 h-4" />
            Simulate New Checkout
          </button>
        </div>
      </div>

      {/* 3 Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <MetricCard
          title="Transactions Supervised"
          value={checkedCount}
          subtitle="This calendar month"
          icon={<CreditCard className="w-5 h-5 text-navy-800" />}
          trend={{ value: '+14% vs last mo', positive: true }}
        />
        <MetricCard
          title="Held for Security Review"
          value={heldCount}
          subtitle="Pending customer verification"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          badge={heldCount > 0 ? (
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold animate-pulse">Action Needed</span>
          ) : undefined}
        />
        <MetricCard
          title="Fraudulent Charges Blocked"
          value={declinedCount}
          subtitle="Automated block & protected"
          icon={<ShieldAlert className="w-5 h-5 text-rose-600" />}
        />
      </div>

      {/* Pending Attention Notice Card */}
      {heldCount > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 mt-0.5">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-950">Transaction Held for Security Review</p>
              <p className="text-xs text-amber-800 mt-0.5">
                A recent checkout of <strong>$1,849.99</strong> at ElectroDepot Tech Superstore was placed on hold. Please confirm if this purchase was made by you.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/customer/transactions/tx-9942')}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm whitespace-nowrap"
          >
            Review & Confirm
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Recent Activity Table */}
      <div className="bg-surface rounded-2xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Transactions</h3>
            <p className="text-xs text-slate-500">Latest card authorizations and settlement statuses</p>
          </div>
          <button
            onClick={() => navigate('/customer/transactions')}
            className="text-xs font-bold text-brand-blue hover:text-brand-dark flex items-center gap-1 transition-colors"
          >
            View all history
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold">
                <th className="py-3 px-6">Merchant & Category</th>
                <th className="py-3 px-6">Date & Time</th>
                <th className="py-3 px-6">Card Token</th>
                <th className="py-3 px-6">Amount</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {transactions.slice(0, 5).map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shadow-xs">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{tx.merchant}</p>
                        <p className="text-[11px] text-slate-400">{tx.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-slate-500">
                    {new Date(tx.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3.5 px-6 font-mono text-slate-500">
                    &bull;&bull;&bull;&bull; {tx.cardLast4}
                  </td>
                  <td className="py-3.5 px-6 font-bold text-slate-900 font-mono">
                    ${tx.amount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-6">
                    <StatusBadge status={tx.status} />
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => navigate(`/customer/transactions/${tx.id}`)}
                      className="text-brand-blue hover:text-brand-dark font-bold inline-flex items-center gap-1 hover:underline"
                    >
                      Tracker
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
