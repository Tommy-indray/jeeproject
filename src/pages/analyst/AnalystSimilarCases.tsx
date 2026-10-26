import React from 'react';
import { UmapScatterPlot } from '../../components/charts/UmapScatterPlot';
import { MOCK_SIMILAR_CASES } from '../../services/mockData';
import { StatusBadge } from '../../components/common/StatusBadge';
import { GitFork, ArrowRight, Shield } from 'lucide-react';

export const AnalystSimilarCases: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Similar Historical Cases & Embeddings</h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-navy-100 text-navy-800">
            K-NN + UMAP
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Nearest neighbor lookup in high-dimensional fraud latent space comparing current transaction to past adjudicated decisions.
        </p>
      </div>

      {/* UMAP Visualization */}
      <UmapScatterPlot highlightId="curr-1" />

      {/* Historical Similar Cases Table */}
      <div className="bg-surface rounded-card border border-slate-200 shadow-subtle overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <GitFork className="w-4 h-4 text-brand-blue" />
            Top Matching Historical Transactions
          </h3>
          <span className="text-xs text-slate-400 font-medium">Cosine Distance &bull; Metric: Normalized Euclidian</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold">
                <th className="py-3 px-6">Historical Case</th>
                <th className="py-3 px-6">Merchant & Category</th>
                <th className="py-3 px-6">Amount</th>
                <th className="py-3 px-6">Similarity Score</th>
                <th className="py-3 px-6">Matching Key Factors</th>
                <th className="py-3 px-6">Final Adjudication</th>
                <th className="py-3 px-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {MOCK_SIMILAR_CASES.map(sc => (
                <tr key={sc.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6 font-mono font-bold text-navy-800">
                    {sc.caseId}
                  </td>
                  <td className="py-3.5 px-6">
                    <p className="font-semibold text-slate-900">{sc.merchant}</p>
                    <p className="text-[11px] text-slate-400">{sc.category}</p>
                  </td>
                  <td className="py-3.5 px-6 font-mono font-bold text-slate-900">
                    ${sc.amount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-600">{sc.similarityScore}%</span>
                      <div className="w-14 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-brand-blue h-full rounded-full" style={{ width: `${sc.similarityScore}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {sc.matchingAttributes.map((attr, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600">
                          {attr}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-6">
                    <StatusBadge status={sc.resolution} size="sm" />
                  </td>
                  <td className="py-3.5 px-6 text-slate-500 font-mono">
                    {sc.date}
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

