import React from 'react';
import { MetricCard } from '../../components/common/MetricCard';
import { ConfusionMatrix } from '../../components/charts/ConfusionMatrix';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { BarChart3, Clock, CheckCircle2, UserCheck, Shield } from 'lucide-react';

const WORKLOAD_DATA = [
  { day: 'Mon', reviewed: 32, agreed: 30 },
  { day: 'Tue', reviewed: 41, agreed: 39 },
  { day: 'Wed', reviewed: 28, agreed: 27 },
  { day: 'Thu', reviewed: 38, agreed: 36 },
  { day: 'Fri', reviewed: 45, agreed: 44 },
];

export const AnalystAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Analyst Workload & Model Agreement</h2>
        <p className="text-xs text-slate-500 mt-1">
          Operational metrics measuring investigation queue velocity, human adjudication agreement, and empirical model calibration.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Review Rate"
          value="3.8%"
          subtitle="Transactions routed to human"
          icon={<Shield className="w-5 h-5 text-navy-800" />}
        />
        <MetricCard
          title="Average Handling Time (AHT)"
          value="1m 48s"
          subtitle="-22s vs last sprint"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          trend={{ value: '18% faster', positive: true }}
        />
        <MetricCard
          title="Cases Resolved"
          value="184"
          subtitle="This calendar week"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        />
        <MetricCard
          title="Human vs ML Agreement"
          value="96.2%"
          subtitle="High model fidelity"
          icon={<UserCheck className="w-5 h-5 text-blue-600" />}
          badge={<span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Optimal</span>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Confusion Matrix on Left */}
        <div className="lg:col-span-6">
          <ConfusionMatrix tp={342} fp={28} fn={14} tn={4820} />
        </div>

        {/* Daily Review Workload on Right */}
        <div className="lg:col-span-6 bg-surface rounded-card border border-slate-200 p-5 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Weekly Case Adjudication Volume</h4>
              <p className="text-xs text-slate-500 mt-0.5">Reviewed cases vs model consensus</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-blue-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" /> Total Reviewed
              </span>
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> ML Agreed
              </span>
            </div>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WORKLOAD_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#FFF', fontSize: '12px' }}
                />
                <Bar dataKey="reviewed" fill="#2563EB" radius={[4, 4, 0, 0]} name="Cases Reviewed" />
                <Bar dataKey="agreed" fill="#10B981" radius={[4, 4, 0, 0]} name="Model Agreed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

