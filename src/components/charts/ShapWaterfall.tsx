import React from 'react';
import { ShapFeatureContribution } from '../../types/contracts';
import { Info, TrendingUp, TrendingDown } from 'lucide-react';

interface ShapWaterfallProps {
  baseValue: number;
  finalScore: number;
  features: ShapFeatureContribution[];
}

export const ShapWaterfall: React.FC<ShapWaterfallProps> = ({
  baseValue,
  finalScore,
  features
}) => {
  // Sort features by absolute contribution magnitude
  const sorted = [...features].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

  return (
    <div className="bg-surface rounded-card border border-slate-200 p-5 shadow-subtle">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
            SHAP Waterfall — Prediction Explainability
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Marginal feature contributions pushing risk above or below population baseline
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Final Predicted Risk</span>
          <p className="text-lg font-bold text-slate-900">{(finalScore * 100).toFixed(1)}%</p>
        </div>
      </div>

      {/* Baseline / Output strip */}
      <div className="mt-4 flex items-center justify-between bg-slate-50 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 border border-slate-200/60">
        <span>Base population fraud rate (E[f(x)]): <strong>{(baseValue * 100).toFixed(1)}%</strong></span>
        <span className="text-slate-400">→</span>
        <span>Observed transaction score (f(x)): <strong className="text-navy-800">{(finalScore * 100).toFixed(1)}%</strong></span>
      </div>

      {/* Feature Contribution Bars */}
      <div className="mt-5 space-y-3.5">
        {sorted.map((item, index) => {
          const isRiskIncrease = item.contribution > 0;
          const pctWidth = Math.min(100, Math.abs(item.contribution) * 200);

          return (
            <div key={index} className="text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  {isRiskIncrease ? (
                    <TrendingUp className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  )}
                  <span className="font-medium text-slate-800">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono text-[11px]">{item.value}</span>
                  <span className={`font-mono font-semibold ${isRiskIncrease ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {isRiskIncrease ? `+${(item.contribution * 100).toFixed(1)}%` : `${(item.contribution * 100).toFixed(1)}%`}
                  </span>
                </div>
              </div>

              {/* Bar visualization */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                {isRiskIncrease ? (
                  <div
                    className="bg-gradient-to-r from-rose-400 to-rose-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pctWidth}%` }}
                  />
                ) : (
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pctWidth}%` }}
                  />
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 italic">{item.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-400">
        <Info className="w-3.5 h-3.5 text-slate-400" />
        <span>SHAP values quantify empirical Shapley attribution, not legal proof of fraud.</span>
      </div>
    </div>
  );
};

