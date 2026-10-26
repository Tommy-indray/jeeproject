import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { MetricCard } from '../../components/common/MetricCard';
import { PieChart as PieIcon, BarChart3, TrendingUp, ShieldCheck, Sparkles, CreditCard } from 'lucide-react';

const CATEGORY_DATA = [
  { name: 'Electronics', value: 1849.99, color: '#3B82F6' },
  { name: 'Groceries', value: 480.20, color: '#10B981' },
  { name: 'Travel & Dining', value: 340.50, color: '#F59E0B' },
  { name: 'Transportation', value: 165.40, color: '#8B5CF6' },
  { name: 'Subscriptions', value: 45.00, color: '#EC4899' },
];

const MONTHLY_TREND = [
  { month: 'Jun', amount: 1420 },
  { month: 'Jul', amount: 1680 },
  { month: 'Aug', amount: 1540 },
  { month: 'Sep', amount: 1890 },
  { month: 'Oct', amount: 2881 },
];

export const CustomerInsights: React.FC = () => {
  const totalSpend = CATEGORY_DATA.reduce((acc, c) => acc + c.value, 0);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Spending & Protection Insights</h2>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-brand-blue uppercase font-mono">
            Analytics
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          High-level overview of card authorization categories and verified volumes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <MetricCard
          title="Total Spending (Oct)"
          value={`$${totalSpend.toFixed(2)}`}
          subtitle="Across 34 total transactions"
          icon={<PieIcon className="w-5 h-5 text-navy-800" />}
          trend={{ value: '+18% vs Sep', positive: false }}
        />
        <MetricCard
          title="Protected Volume"
          value="100%"
          subtitle="Zero unauthorized losses"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
          badge={<span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Safe</span>}
        />
        <MetricCard
          title="Top Category"
          value="Electronics"
          subtitle="64.2% of current monthly volume"
          icon={<BarChart3 className="w-5 h-5 text-blue-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Donut Chart */}
        <div className="bg-surface rounded-2xl border border-slate-200 p-6 shadow-card">
          <h4 className="text-sm font-bold text-slate-900 mb-0.5">Expenditure by Category</h4>
          <p className="text-xs text-slate-500 mb-4">Breakdown of October cleared & pending charges</p>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`$${Number(val).toFixed(2)}`, 'Amount']}
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#FFF', fontSize: '12px', border: 'none' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-slate-100 text-xs">
            {CATEGORY_DATA.map((c, i) => (
              <div key={i} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50/70 border border-slate-100">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                <span className="text-slate-600 truncate text-[11px] font-medium">{c.name}</span>
                <span className="font-bold text-slate-900 ml-auto font-mono text-[11px]">${c.value.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend Bar Chart */}
        <div className="bg-surface rounded-2xl border border-slate-200 p-6 shadow-card">
          <h4 className="text-sm font-bold text-slate-900 mb-0.5">Monthly Spending Trend</h4>
          <p className="text-xs text-slate-500 mb-4">Historical 5-month comparison</p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_TREND} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} />
                <Tooltip
                  formatter={(val: any) => [`$${val}`, 'Monthly Volume']}
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#FFF', fontSize: '12px', border: 'none' }}
                />
                <Bar dataKey="amount" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Average Monthly Volume: <strong className="text-slate-800 font-mono">$1,882.20</strong></span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> High seasonal spike in Oct
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
