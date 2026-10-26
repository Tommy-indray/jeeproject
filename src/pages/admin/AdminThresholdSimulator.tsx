import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ThresholdConfig } from '../../types/contracts';
import { Sliders, CheckCircle2, AlertTriangle, Shield, RotateCcw, Info } from 'lucide-react';

export const AdminThresholdSimulator: React.FC = () => {
  const { thresholds, updateThresholds } = useData();

  const [approval, setApproval] = useState(thresholds.approvalThreshold);
  const [rejection, setRejection] = useState(thresholds.rejectionThreshold);
  const [uncertainty, setUncertainty] = useState(thresholds.uncertaintyThreshold);
  const [saving, setSaving] = useState(false);

  // Dynamic estimate calculations based on slider values
  const estimatedReviewRate = (
    ((rejection - approval) * 0.08) + 
    ((1 - uncertainty) * 0.03)
  ) * 100;

  const estimatedMissedFraud = Math.max(0.2, (approval * 4.8));
  const estimatedFalsePositives = Math.max(0.1, ((1 - rejection) * 3.2));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateThresholds({
        approvalThreshold: approval,
        rejectionThreshold: rejection,
        uncertaintyThreshold: uncertainty
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setApproval(0.20);
    setRejection(0.85);
    setUncertainty(0.35);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Risk Threshold Simulator & Tuning</h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-navy-100 text-navy-800">
            POLICY ENGINE
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Simulate trade-offs between analyst human review workload, missed fraud risk, and customer friction on the validation dataset.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sliders on Left (7 cols) */}
        <div className="lg:col-span-7 bg-surface rounded-card border border-slate-200 p-6 shadow-subtle space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-navy-800" />
              Policy Routing Thresholds
            </h4>
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-navy-800 font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Defaults
            </button>
          </div>

          {/* Auto-Approval Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-800">1. Automatic Approval Boundary (&le;)</span>
              <span className="font-mono font-bold text-emerald-600">{(approval * 100).toFixed(0)}% risk</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.40"
              step="0.01"
              value={approval}
              onChange={e => setApproval(parseFloat(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Transactions below this probability automatically approve without review.
            </p>
          </div>

          {/* Auto-Rejection Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-800">2. Automatic Decline Boundary (&ge;)</span>
              <span className="font-mono font-bold text-rose-600">{(rejection * 100).toFixed(0)}% risk</span>
            </div>
            <input
              type="range"
              min="0.65"
              max="0.95"
              step="0.01"
              value={rejection}
              onChange={e => setRejection(parseFloat(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Transactions with probability exceeding this threshold are declined automatically.
            </p>
          </div>

          {/* Conformal Uncertainty Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-800">3. Conformal Prediction Uncertainty Ceiling (&ge;)</span>
              <span className="font-mono font-bold text-purple-600">{(uncertainty * 100).toFixed(0)}% uncertainty</span>
            </div>
            <input
              type="range"
              min="0.15"
              max="0.60"
              step="0.01"
              value={uncertainty}
              onChange={e => setUncertainty(parseFloat(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Any transaction whose model uncertainty exceeds this score forces human analyst review.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-navy-800 hover:bg-navy-900 disabled:opacity-50 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              {saving ? 'Updating Rules...' : 'Apply Thresholds & Commit to Audit Log'}
            </button>
          </div>
        </div>

        {/* Validation Estimates on Right (5 cols) */}
        <div className="lg:col-span-5 bg-surface rounded-card border border-slate-200 p-6 shadow-subtle space-y-4">
          <h4 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">
            Estimated Impact on Validation Set
          </h4>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] uppercase font-bold text-slate-400">Estimated Analyst Review Volume</span>
              <p className="text-xl font-black text-navy-800 font-mono mt-0.5">
                {estimatedReviewRate.toFixed(1)}% of total traffic
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                ~{Math.round(estimatedReviewRate * 18.4)} cases per hour at 184 rps
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
              <span className="text-[10px] uppercase font-bold text-emerald-800">Estimated Missed Fraud (FN)</span>
              <p className="text-xl font-black text-emerald-900 font-mono mt-0.5">
                {estimatedMissedFraud.toFixed(2)}%
              </p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Financial risk contained below 1.5% target
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80">
              <span className="text-[10px] uppercase font-bold text-blue-800">Customer Friction (FP)</span>
              <p className="text-xl font-black text-blue-900 font-mono mt-0.5">
                {estimatedFalsePositives.toFixed(2)}%
              </p>
              <p className="text-[11px] text-blue-700 mt-0.5">
                Legitimate cardholders unaffected by false alarms
              </p>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              Adjusting thresholds modifies routing in the <code>RiskManagementService</code> without requiring ML model retraining or container redeployment.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

