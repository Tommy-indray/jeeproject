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
  ExternalLink,
  Lock
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
      {/* Protection Status Banner (Reassuring, factual, no internal model scores) */}
      <div className="bg-gradient-to-r from-navy-800 to-navy-900 rounded-card p-6 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">Protected by Vigilia</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE SHIELD
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Hello, {currentUser.name}. Your account is continuously supervised with intelligent anomaly verification and zero-latency authorization.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => navigate('/customer/checkout')}
            className="w-full md:w-auto bg-brand-blue hover:bg-brand-dark text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Simulate New Checkout
          </button>
        </div>
      </div>

      {/* 3 Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <MetricCard
          title="Transactions Checked"
          value={checkedCount}
          subtitle="This calendar month"
          icon={<CreditCard className="w-5 h-5 text-navy-800" />}
          trend={{ value: '+14% vs last mo', positive: true }}
        />
        <MetricCard
          title="Held for Security Review"
          value={heldCount}
          subtitle="Pending customer response"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          badge={heldCount > 0 ? (
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">Action Needed</span>
          ) : undefined}
        />
        <MetricCard
          title="Suspicious Transactions Declined"
          value={declinedCount}
          subtitle="Automated block & protected"
          icon={<ShieldAlert className="w-5 h-5 text-rose-600" />}
        />
      </div>

      {/* Pending Attention Notice if any */}
      {heldCount > 0 && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-900">Transaction Held for Your Review</p>
              <p className="text-xs text-amber-700 mt-0.5">
                A recent checkout of $1,849.99 at ElectroDepot Tech Superstore was placed on hold. Please confirm if this was you.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/customer/transactions/tx-9942')}
            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            Review Now
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Recent Activity Table */}
      <div className="bg-surface rounded-card border border-slate-200 shadow-subtle overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Transactions</h3>
            <p className="text-xs text-slate-500">Latest card authorizations and settlement statuses</p>
          </div>
          <button
            onClick={() => navigate('/customer/transactions')}
            className="text-xs font-semibold text-brand-blue hover:text-brand-dark flex items-center gap-1"
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
                <th className="py-3 px-6">Card</th>
                <th className="py-3 px-6">Amount</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {transactions.slice(0, 5).map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{tx.merchant}</p>
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
                  <td className="py-3.5 px-6 font-semibold text-slate-900">
                    ${tx.amount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-6">
                    <StatusBadge status={tx.status} />
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => navigate(`/customer/transactions/${tx.id}`)}
                      className="text-brand-blue hover:text-brand-dark font-medium inline-flex items-center gap-1"
                    >
                      Details
                      <ArrowRight className="w-3 h-3" />
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

