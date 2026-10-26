import React from 'react';
import { MetricCard } from '../../components/common/MetricCard';
import { LatencyThroughputChart } from '../../components/charts/LatencyThroughputChart';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip 
} from 'recharts';
import { 
  Activity, 
  Server, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const DECISION_MIX = [
  { name: 'Auto-Approved', value: 94.2, color: '#10B981' },
  { name: 'Held for Human Review', value: 3.8, color: '#F59E0B' },
  { name: 'Auto-Declined', value: 2.0, color: '#EF4444' },
];

export const AdminOperations: React.FC = () => {
  const { cases } = useData();
  const { alerts } = useNotification();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Page Title & Environment Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Platform Operations Overview</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              PRODUCTION K8S
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time telemetry and supervisory controls across the 8 Spring Boot & FastAPI microservices.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>Last scraped: <strong>Just now</strong> (Prometheus 15s scrape interval)</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Cluster Throughput"
          value="184 req/s"
          subtitle="Spring Gateway + FastAPI"
          icon={<Activity className="w-5 h-5 text-blue-600" />}
          trend={{ value: '+12% load', positive: true }}
        />
        <MetricCard
          title="p95 Global Latency"
          value="14.2 ms"
          subtitle="ML inference: 11.8 ms"
          icon={<Clock className="w-5 h-5 text-emerald-600" />}
          badge={<span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">&lt; 50ms SLA</span>}
        />
        <MetricCard
          title="Error Rate"
          value="0.02%"
          subtitle="HTTP 5xx & circuit errors"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        />
        <MetricCard
          title="FastAPI Model Health"
          value="UP"
          subtitle="XGBoost Champion v3"
          icon={<Cpu className="w-5 h-5 text-navy-800" />}
          badge={<span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">4 Replicas</span>}
        />
      </div>

      {/* Real-time Telemetry Area Chart */}
      <LatencyThroughputChart />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Decision Mix Donut Chart (5 cols) */}
        <div className="lg:col-span-5 bg-surface rounded-card border border-slate-200 p-5 shadow-subtle">
          <h4 className="text-sm font-semibold text-slate-900 mb-1">Decision Volume Distribution</h4>
          <p className="text-xs text-slate-500 mb-3">Split between automated decisions & human reviews</p>

          <div className="h-52 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DECISION_MIX}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {DECISION_MIX.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Decision Ratio']}
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#FFF', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-2 pt-3 border-t border-slate-100 text-xs">
            {DECISION_MIX.map((d, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name}
                </span>
                <span className="font-bold text-slate-900 font-mono">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active System Alerts & Degraded Banner (7 cols) */}
        <div className="lg:col-span-7 bg-surface rounded-card border border-slate-200 p-5 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h4 className="text-sm font-semibold text-slate-900">Active Operational Alerts</h4>
            </div>
            <button
              onClick={() => navigate('/admin/services')}
              className="text-xs font-semibold text-brand-blue hover:underline flex items-center gap-1"
            >
              Service Topology
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {alerts.map(a => (
              <div 
                key={a.id} 
                className={`p-3.5 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                  a.severity === 'CRITICAL' ? 'bg-rose-50 border-rose-200 text-rose-900' :
                  a.severity === 'WARNING' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                  'bg-blue-50 border-blue-200 text-blue-900'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 font-bold">
                    <span>{a.title}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/60">
                      {a.service}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-700">
                    {a.message}
                  </p>
                </div>
                {a.actionUrl && (
                  <button
                    onClick={() => navigate(a.actionUrl!)}
                    className="flex-shrink-0 text-[11px] font-bold text-brand-blue hover:underline"
                  >
                    Investigate &rarr;
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

