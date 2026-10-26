import React from 'react';
import { ShapWaterfall } from '../../components/charts/ShapWaterfall';
import { CalibrationCurve } from '../../components/charts/CalibrationCurve';
import { useData } from '../../context/DataContext';
import { Cpu, ShieldCheck, Activity, Info } from 'lucide-react';

export const AnalystModelExplanation: React.FC = () => {
  const { cases } = useData();
  const currentCase = cases[0];
  const prediction = currentCase?.transaction.prediction;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Model Explainability & Uncertainty</h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-navy-100 text-navy-800">
            XGBOOST v3 + SHAP
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Detailed inspection of model confidence intervals, Shapley attributions, and calibration reliability curves.
        </p>
      </div>

      {prediction?.explanation && (
        <ShapWaterfall
          baseValue={prediction.explanation.base_value}
          finalScore={prediction.probability}
          features={prediction.explanation.top_features}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <CalibrationCurve brierScore={0.0028} />

        <div className="bg-surface rounded-card border border-slate-200 p-5 shadow-subtle space-y-3.5 text-xs">
          <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-brand-blue" />
            Uncertainty & Conformal Prediction Theory
          </h4>
          <p className="text-slate-600 leading-relaxed">
            Standard ML classification outputs often exhibit overconfidence. In Vigilia, Member 2 implements <strong>Split-Conformal Prediction</strong> and Platt calibration.
          </p>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between font-mono">
              <span className="text-slate-500">Uncertainty Metric:</span>
              <span className="font-bold text-purple-700">Conformal P-Value Non-Conformity</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-slate-500">Coverage Level (1 - &alpha;):</span>
              <span className="font-bold text-slate-900">95.0% Guaranteed</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-slate-500">Human Review Threshold:</span>
              <span className="font-bold text-amber-600">&gt; 0.35 Uncertainty Band</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-slate-500 flex items-start gap-2 text-[11px]">
            <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <span>
              Transactions falling inside the high uncertainty interval automatically transfer to human review rather than executing high-risk automatic declines.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

