import React, { useState } from 'react';
import { UmapEmbeddingPoint } from '../../types/contracts';
import { MOCK_UMAP_POINTS } from '../../services/mockData';
import { Filter, Layers, Maximize2, RotateCcw, Target, Sparkles } from 'lucide-react';

interface UmapScatterPlotProps {
  points?: UmapEmbeddingPoint[];
  highlightId?: string;
  onSelectPoint?: (point: UmapEmbeddingPoint) => void;
}

export const UmapScatterPlot: React.FC<UmapScatterPlotProps> = ({
  points = MOCK_UMAP_POINTS,
  highlightId = 'curr-1',
  onSelectPoint
}) => {
  const [filter, setFilter] = useState<'ALL' | 'FRAUD' | 'LEGITIMATE' | 'UNCERTAIN'>('ALL');
  const [hoveredPoint, setHoveredPoint] = useState<UmapEmbeddingPoint | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<UmapEmbeddingPoint | null>(null);

  // Normalize coordinates (-6 to 8 on X, -5 to 7 on Y) to SVG space (600x340)
  const mapCoords = (x: number, y: number) => {
    const minX = -6;
    const maxX = 8;
    const minY = -5;
    const maxY = 7;

    const svgX = ((x - minX) / (maxX - minX)) * 520 + 40;
    const svgY = ((maxY - y) / (maxY - minY)) * 260 + 40;
    return { x: svgX, y: svgY };
  };

  const filteredPoints = points.filter(p => {
    if (filter === 'FRAUD') return p.label === 'FRAUD';
    if (filter === 'LEGITIMATE') return p.label === 'LEGITIMATE';
    if (filter === 'UNCERTAIN') return p.uncertainty > 0.35;
    return true;
  });

  return (
    <div className="bg-surface rounded-2xl border border-slate-200 p-5 shadow-card flex flex-col justify-between">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-blue-50 text-brand-blue">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">UMAP / PCA 2D Manifold & Class Latent Space</h4>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Non-linear dimension projection of 30+ transaction features, decision contours & uncertainty heat
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1 rounded-lg transition-all font-semibold ${
              filter === 'ALL' ? 'bg-white text-navy-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Clusters
          </button>
          <button
            onClick={() => setFilter('FRAUD')}
            className={`px-3 py-1 rounded-lg transition-all font-semibold ${
              filter === 'FRAUD' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Fraud
          </button>
          <button
            onClick={() => setFilter('LEGITIMATE')}
            className={`px-3 py-1 rounded-lg transition-all font-semibold ${
              filter === 'LEGITIMATE' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Legitimate
          </button>
          <button
            onClick={() => setFilter('UNCERTAIN')}
            className={`px-3 py-1 rounded-lg transition-all font-semibold ${
              filter === 'UNCERTAIN' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            High Uncertainty
          </button>
        </div>
      </div>

      {/* SVG Scatter Plot Canvas Area */}
      <div className="relative mt-4 h-80 bg-gradient-to-b from-slate-950 via-slate-900 to-navy-950 rounded-xl overflow-hidden border border-slate-800 select-none shadow-inner">
        {/* Radar concentric circular grid */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
          <div className="w-[500px] h-[500px] rounded-full border border-blue-400" />
          <div className="w-[300px] h-[300px] rounded-full border border-blue-400 absolute" />
        </div>

        {/* Subtle grid lines */}
        <svg className="w-full h-full" viewBox="0 0 600 340">
          <defs>
            <radialGradient id="clusterGlowLegit" cx="20%" cy="80%" r="40%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="clusterGlowFraud" cx="80%" cy="20%" r="40%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </radialGradient>

            <filter id="reticleGlow">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Background cluster densities */}
          <rect width="600" height="340" fill="url(#clusterGlowLegit)" />
          <rect width="600" height="340" fill="url(#clusterGlowFraud)" />

          {/* Decision boundary approximation curve */}
          <path
            d="M 120 0 Q 320 180 500 340"
            fill="none"
            stroke="#64748B"
            strokeWidth="1.5"
            strokeDasharray="4,4"
            opacity="0.6"
          />

          {/* Floating cluster labels inside SVG */}
          <text x="90" y="290" fill="#10B981" opacity="0.6" fontSize="11" fontWeight="bold" letterSpacing="1">
            LEGITIMATE CLUSTER (99.8%)
          </text>
          <text x="400" y="50" fill="#EF4444" opacity="0.6" fontSize="11" fontWeight="bold" letterSpacing="1">
            HIGH-RISK FRAUD ZONE
          </text>

          {/* Render Data Points */}
          {filteredPoints.map(pt => {
            const coords = mapCoords(pt.x, pt.y);
            const isHighlight = pt.isCurrent || pt.id === highlightId;
            const isHighUncertainty = pt.uncertainty > 0.35;

            let fillColor = pt.label === 'FRAUD' ? '#EF4444' : '#10B981';
            if (isHighUncertainty) fillColor = '#A855F7';

            return (
              <g 
                key={pt.id} 
                className="cursor-pointer transition-transform duration-150 hover:scale-150"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
                onClick={() => {
                  setSelectedPoint(pt);
                  onSelectPoint && onSelectPoint(pt);
                }}
              >
                {/* Outlier halo */}
                {pt.isOutlier && (
                  <circle cx={coords.x} cy={coords.y} r="14" fill="#F59E0B" fillOpacity="0.25" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3,2" />
                )}

                {/* Animated Pulsing Reticle for Active Investigated Case */}
                {isHighlight && (
                  <g filter="url(#reticleGlow)">
                    <circle cx={coords.x} cy={coords.y} r="22" fill="none" stroke="#60A5FA" strokeWidth="1.5" className="animate-ping" opacity="0.75" />
                    <circle cx={coords.x} cy={coords.y} r="15" fill="#3B82F6" fillOpacity="0.25" stroke="#60A5FA" strokeWidth="2" />
                    <line x1={coords.x - 22} y1={coords.y} x2={coords.x + 22} y2={coords.y} stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="3,3" />
                    <line x1={coords.x} y1={coords.y - 22} x2={coords.x} y2={coords.y + 22} stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="3,3" />
                  </g>
                )}

                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={isHighlight ? 7.5 : pt.isOutlier ? 6 : 5}
                  fill={isHighlight ? '#3B82F6' : fillColor}
                  stroke={isHighlight ? '#FFFFFF' : '#0F172A'}
                  strokeWidth="1.5"
                />
              </g>
            );
          })}
        </svg>

        {/* Hovered Point Floating Glass Tooltip */}
        {hoveredPoint && (
          <div className="absolute top-3 left-4 bg-slate-900/95 backdrop-blur-md border border-slate-700 text-white rounded-xl p-3 text-xs shadow-elevated z-20 pointer-events-none animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: hoveredPoint.label === 'FRAUD' ? '#EF4444' : '#10B981' }} />
              <p className="font-bold text-slate-100">{hoveredPoint.merchant}</p>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-3 text-slate-300 font-mono text-[11px] pt-1.5 border-t border-slate-800">
              <div>Amount: <strong className="text-white">${hoveredPoint.amount.toFixed(2)}</strong></div>
              <div>Ground Truth: <strong className={hoveredPoint.label === 'FRAUD' ? 'text-rose-400' : 'text-emerald-400'}>{hoveredPoint.label}</strong></div>
              <div>Uncertainty: <strong className="text-purple-300">{(hoveredPoint.uncertainty * 100).toFixed(0)}%</strong></div>
            </div>
          </div>
        )}

        {/* Selected Point Inspection Drawer / Card */}
        {selectedPoint && (
          <div className="absolute bottom-12 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white rounded-xl p-3 text-xs shadow-elevated z-20 flex items-center gap-3">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Selected Sample</p>
              <p className="font-bold">{selectedPoint.merchant} &bull; ${selectedPoint.amount}</p>
            </div>
            <button
              onClick={() => setSelectedPoint(null)}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300"
            >
              Clear
            </button>
          </div>
        )}

        {/* Legend Overlay at Bottom Right */}
        <div className="absolute bottom-2.5 right-3 flex items-center gap-3 bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 text-[11px] text-slate-300 shadow-md">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" /> Legitimate
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs" /> Fraud Cluster
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-xs" /> Uncertain
          </span>
          <span className="flex items-center gap-1.5 font-bold text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-blue-300" /> Investigated Case
          </span>
        </div>
      </div>
    </div>
  );
};
