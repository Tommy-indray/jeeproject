import React, { useState } from 'react';
import { MOCK_MODEL_SNAPSHOTS } from '../../services/mockData';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  Cpu, 
  CheckCircle2, 
  RotateCcw, 
  ShieldCheck, 
  TrendingUp, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export const AdminModelHealth: React.FC = () => {
  const [models, setModels] = useState(MOCK_MODEL_SNAPSHOTS);
  const { showToast } = useNotification();

  const champion = models.find(m => m.status === 'CHAMPION') || models[0];

  const handlePromote = (version: string) => {
    setModels(prev => prev.map(m => {
      if (m.version === version) return { ...m, status: 'CHAMPION' };
      if (m.status === 'CHAMPION') return { ...m, status: 'CANDIDATE' };
      return m;
    }));
    showToast('success', 'Model Promoted to Production', `${version} promoted as active inference engine in FastAPI.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Model Registry & Statistical Benchmarking</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-navy-100 text-navy-800">
              MLFLOW TRACKED
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Empirical benchmark of 5 classification algorithms, Holm-corrected statistical tests, and Kolmogorov-Smirnov drift monitoring.
          </p>
        </div>
      </div>

      {/* Active Champion Model Spotlight */}
      <div className="bg-surface rounded-card border-2 border-emerald-500/30 p-6 shadow-subtle">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{champion.name}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  CURRENT ACTIVE SERVING
                </span>
              </div>
              <p className="text-xs font-mono text-slate-500 mt-0.5">{champion.version} &bull; {champion.algorithm}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Drift Status:</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" /> STABLE (KS p = {champion.driftPValue})
            </span>
          </div>
        </div>

        {/* Core Metric Highlights */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-6 gap-3 text-center">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400">ROC-AUC</span>
            <p className="text-base font-bold text-navy-800 font-mono mt-0.5">{champion.rocAuc.toFixed(4)}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400">PR-AUC</span>
            <p className="text-base font-bold text-navy-800 font-mono mt-0.5">{champion.prAuc.toFixed(4)}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400">F1 Score</span>
            <p className="text-base font-bold text-navy-800 font-mono mt-0.5">{champion.f1.toFixed(3)}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400">Recall</span>
            <p className="text-base font-bold text-navy-800 font-mono mt-0.5">{(champion.recall * 100).toFixed(1)}%</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400">MCC</span>
            <p className="text-base font-bold text-emerald-600 font-mono mt-0.5">{champion.mcc.toFixed(3)}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400">Inference</span>
            <p className="text-base font-bold text-blue-600 font-mono mt-0.5">{champion.inferenceTimeMs} ms</p>
          </div>
        </div>
      </div>

      {/* 5-Algorithm Scientific Benchmark Table (Member 1 Output) */}
      <div className="bg-surface rounded-card border border-slate-200 shadow-subtle overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">5-Model Empirical Benchmark Comparison</h3>
            <p className="text-xs text-slate-500">Evaluated on Credit Card Fraud dataset with 10-fold repeated stratified cross-validation</p>
          </div>
          <span className="text-xs text-slate-400 font-medium">Friedman test &chi;&sup2; = 38.4 (p &lt; 0.001)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold">
                <th className="py-3 px-6">Model Algorithm</th>
                <th className="py-3 px-6">Version</th>
                <th className="py-3 px-6">ROC-AUC</th>
                <th className="py-3 px-6">PR-AUC</th>
                <th className="py-3 px-6">F1</th>
                <th className="py-3 px-6">Precision</th>
                <th className="py-3 px-6">Recall</th>
                <th className="py-3 px-6">Inference Latency</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {models.map(m => (
                <tr key={m.version} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-slate-900">
                    {m.name}
                  </td>
                  <td className="py-3.5 px-6 font-mono text-slate-500">
                    {m.version}
                  </td>
                  <td className="py-3.5 px-6 font-mono font-bold text-navy-800">
                    {m.rocAuc.toFixed(4)}
                  </td>
                  <td className="py-3.5 px-6 font-mono font-bold text-navy-800">
                    {m.prAuc.toFixed(4)}
                  </td>
                  <td className="py-3.5 px-6 font-mono font-bold text-navy-800">
                    {m.f1.toFixed(3)}
                  </td>
                  <td className="py-3.5 px-6 font-mono">
                    {(m.precision * 100).toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-6 font-mono">
                    {(m.recall * 100).toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-6 font-mono text-slate-600">
                    {m.inferenceTimeMs} ms
                  </td>
                  <td className="py-3.5 px-6">
                    <StatusBadge status={m.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    {m.status !== 'CHAMPION' && (
                      <button
                        onClick={() => handlePromote(m.version)}
                        className="text-brand-blue hover:text-brand-dark font-semibold text-[11px] hover:underline"
                      >
                        Promote to Serving
                      </button>
                    )}
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

