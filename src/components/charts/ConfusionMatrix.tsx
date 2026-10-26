import React from 'react';
import { Target, CheckCircle2, AlertOctagon } from 'lucide-react';

interface ConfusionMatrixProps {
  tp?: number;
  fp?: number;
  fn?: number;
  tn?: number;
}

export const ConfusionMatrix: React.FC<ConfusionMatrixProps> = ({
  tp = 342,
  fp = 28,
  fn = 41,
  tn = 4820
}) => {
  const total = tp + fp + fn + tn;
  const precision = tp / (tp + fp);
  const recall = tp / (tp + fn);
  const f1 = (2 * precision * recall) / (precision + recall);
  const accuracy = (tp + tn) / total;
  const mcc = ((tp * tn) - (fp * fn)) / Math.sqrt((tp + fp) * (tp + fn) * (tn + fp) * (tn + fn));

  return (
    <div className="bg-surface rounded-card border border-slate-200 p-5 shadow-subtle">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-navy-800" />
            Confusion Matrix & Empirical Benchmarks
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluated on holdout test set with Holm-corrected cross-validation
          </p>
        </div>
        <span className="text-xs font-mono font-medium text-slate-400">
          N = {total.toLocaleString()} samples
        </span>
      </div>

      {/* 2x2 Matrix Grid */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {/* True Positive */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3 text-center">
          <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">True Positives (TP)</p>
          <p className="text-xl font-bold text-emerald-900 mt-1">{tp.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Fraud accurately blocked</span>
        </div>

        {/* False Positive */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 text-center">
          <p className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">False Positives (FP)</p>
          <p className="text-xl font-bold text-amber-900 mt-1">{fp.toLocaleString()}</p>
          <span className="text-[11px] text-amber-600 font-medium">Legit held for review</span>
        </div>

        {/* False Negative */}
        <div className="bg-rose-50/70 border border-rose-200 rounded-lg p-3 text-center">
          <p className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider">False Negatives (FN)</p>
          <p className="text-xl font-bold text-rose-900 mt-1">{fn.toLocaleString()}</p>
          <span className="text-[11px] text-rose-600 font-medium">Missed fraud risk</span>
        </div>

        {/* True Negative */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
          <p className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">True Negatives (TN)</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{tn.toLocaleString()}</p>
          <span className="text-[11px] text-slate-500 font-medium">Legitimate approved</span>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="mt-4 grid grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-center">
        <div className="bg-slate-50/70 py-2 rounded">
          <span className="text-[10px] uppercase text-slate-400 font-semibold">Precision</span>
          <p className="text-sm font-bold text-navy-800 font-mono">{(precision * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-slate-50/70 py-2 rounded">
          <span className="text-[10px] uppercase text-slate-400 font-semibold">Recall</span>
          <p className="text-sm font-bold text-navy-800 font-mono">{(recall * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-slate-50/70 py-2 rounded">
          <span className="text-[10px] uppercase text-slate-400 font-semibold">F1-Score</span>
          <p className="text-sm font-bold text-navy-800 font-mono">{(f1 * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-slate-50/70 py-2 rounded">
          <span className="text-[10px] uppercase text-slate-400 font-semibold">MCC</span>
          <p className="text-sm font-bold text-emerald-600 font-mono">{mcc.toFixed(3)}</p>
        </div>
      </div>
    </div>
  );
};

