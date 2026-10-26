import React from 'react';
import { ShapFeatureContribution } from '../../types/contracts';
import { Info, TrendingUp, TrendingDown, Cpu, Sparkles } from 'lucide-react';

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
    <div className="bg-surface rounded-2xl border border-slate-200 p-6 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-navy-50 text-navy-800">
              <Cpu className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              SHAP Waterfall &mdash; Feature Marginal Attribution
            </h4>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Local Shapley additive values explaining why the ML model deviated from population base rate
          </p>
        </div>

        <div className="text-right flex items-center gap-3 sm:block">
          <span className="text-[10px] uppercase font-bold text-slate-400">Model Output Probability</span>
          <p className="text-2xl font-black text-rose-600 font-mono">{(finalScore * 100).toFixed(1)}%</p>
        </div>
      </div>

      {/* Baseline / Output Flow Strip */}
      <div className="mt-4 flex flex-wrap items-center justify-between bg-gradient-to-r from-slate-50 via-blue-50/20 to-slate-50 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 border border-slate-200/70 gap-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          Base Population Fraud Rate (E[f(x)]): <strong className="font-mono text-slate-900">{(baseValue * 100).toFixed(1)}%</strong>
        </span>
        <span className="text-slate-400">&rarr;</span>
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          Observed Transaction Risk (f(x)): <strong className="font-mono text-rose-600">{(finalScore * 100).toFixed(1)}%</strong>
        </span>
      </div>

      {/* Feature Contribution Bars with Rich Gradients */}
      <div className="mt-5 space-y-4">
        {sorted.map((item, index) => {
          const isRiskIncrease = item.contribution > 0;
          const pctWidth = Math.min(100, Math.abs(item.contribution) * 200);

          return (
            <div key={index} className="text-xs group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`p-1 rounded-md ${isRiskIncrease ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {isRiskIncrease ? (
                      <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 flex-shrink-0" />
                    )}
                  </span>
                  <span className="font-bold text-slate-800">{item.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                    {item.value}
                  </span>
                  <span className={`font-mono font-bold text-xs w-16 text-right ${isRiskIncrease ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {isRiskIncrease ? `+${(item.contribution * 100).toFixed(1)}%` : `${(item.contribution * 100).toFixed(1)}%`}
                  </span>
                </div>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full bg-slate-100/90 rounded-full h-2.5 overflow-hidden flex">
                {isRiskIncrease ? (
                  <div
                    className="bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 h-full rounded-full transition-all duration-500 shadow-xs"
                    style={{ width: `${pctWidth}%` }}
                  />
                ) : (
                  <div
                    className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 h-full rounded-full transition-all duration-500 shadow-xs"
                    style={{ width: `${pctWidth}%` }}
                  />
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 italic pl-1 leading-snug">{item.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>SHAP values quantify empirical Shapley attribution, not legal proof of fraud.</span>
        </div>
        <span className="font-mono font-medium text-slate-500">FastAPI Model Serving v0.1</span>
      </div>
    </div>
  );
};
