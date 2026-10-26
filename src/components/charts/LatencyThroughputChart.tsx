import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

interface LatencyThroughputChartProps {
  data?: Array<{ time: string; rps: number; latency: number; errors: number }>;
}

const DEFAULT_METRIC_DATA = [
  { time: '10:00', rps: 45, latency: 12.4, errors: 0 },
  { time: '10:05', rps: 82, latency: 13.8, errors: 0 },
  { time: '10:10', rps: 145, latency: 16.2, errors: 0.1 },
  { time: '10:15', rps: 340, latency: 28.5, errors: 0.8 }, // Burst
  { time: '10:20', rps: 820, latency: 185.0, errors: 4.2 }, // Overload
  { time: '10:25', rps: 920, latency: 240.0, errors: 6.8 }, // HPA triggers 4 pods
  { time: '10:30', rps: 620, latency: 45.0, errors: 0.9 }, // Autoscaled Recovery
  { time: '10:35', rps: 210, latency: 15.2, errors: 0.0 }, // Stabilized
  { time: '10:40', rps: 150, latency: 13.1, errors: 0.0 }
];

export const LatencyThroughputChart: React.FC<LatencyThroughputChartProps> = ({
  data = DEFAULT_METRIC_DATA
}) => {
  return (
    <div className="bg-surface rounded-card border border-slate-200 p-5 shadow-subtle">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            System Telemetry — Throughput (RPS) & p95 Latency (ms)
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time Prometheus scraping from Kubernetes Ingress & FastAPI worker pods
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 font-medium text-blue-600">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> Throughput (RPS)
          </span>
          <span className="flex items-center gap-1.5 font-medium text-amber-600">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> p95 Latency (ms)
          </span>
        </div>
      </div>

      <div className="h-64 mt-4 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="rpsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="latGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B' }} />
            <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', border: 'none', color: '#FFF', fontSize: '12px' }}
              labelStyle={{ color: '#94A3B8', fontWeight: 600 }}
            />
            <Area type="monotone" dataKey="rps" name="Throughput (req/s)" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#rpsGradient)" />
            <Area type="monotone" dataKey="latency" name="p95 Latency (ms)" stroke="#D97706" strokeWidth={2} fillOpacity={1} fill="url(#latGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

