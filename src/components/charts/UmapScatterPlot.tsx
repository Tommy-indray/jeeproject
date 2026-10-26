import React, { useState } from 'react';
import { UmapEmbeddingPoint } from '../../types/contracts';
import { MOCK_UMAP_POINTS } from '../../services/mockData';
import { Filter, Layers, Maximize2 } from 'lucide-react';

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

  // Normalize coordinates (-5.5 to 7.5 on X, -4.5 to 6.5 on Y) to SVG space (600x340)
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
    <div className="bg-surface rounded-card border border-slate-200 p-5 shadow-subtle flex flex-col justify-between">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-blue" />
            <h4 className="text-sm font-semibold text-slate-900">UMAP / PCA 2D Manifold Space</h4>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Non-linear dimension projection of 30+ transaction features & decision boundaries
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-lg text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-2.5 py-1 rounded-md transition-colors font-medium ${filter === 'ALL' ? 'bg-white text-navy-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            All Clusters
          </button>
          <button
            onClick={() => setFilter('FRAUD')}
            className={`px-2.5 py-1 rounded-md transition-colors font-medium ${filter === 'FRAUD' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Fraud
          </button>
          <button
            onClick={() => setFilter('LEGITIMATE')}
            className={`px-2.5 py-1 rounded-md transition-colors font-medium ${filter === 'LEGITIMATE' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Legitimate
          </button>
          <button
            onClick={() => setFilter('UNCERTAIN')}
            className={`px-2.5 py-1 rounded-md transition-colors font-medium ${filter === 'UNCERTAIN' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            High Uncertainty
          </button>
        </div>
      </div>

      {/* SVG Scatter Plot Area */}
      <div className="relative mt-4 h-72 bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
        {/* Subtle grid lines */}
        <svg className="w-full h-full" viewBox="0 0 600 340">
          <defs>
            <radialGradient id="clusterGlowLegit" cx="20%" cy="80%" r="40%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="clusterGlowFraud" cx="80%" cy="20%" r="40%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background cluster densities */}
          <rect width="600" height="340" fill="url(#clusterGlowLegit)" />
          <rect width="600" height="340" fill="url(#clusterGlowFraud)" />

          {/* Decision boundary approximation curve */}
          <path
            d="M 120 0 Q 320 180 500 340"
            fill="none"
            stroke="#475569"
            strokeWidth="1.5"
            strokeDasharray="4,4"
            opacity="0.6"
          />

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
                className="cursor-pointer transition-transform hover:scale-125"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
                onClick={() => onSelectPoint && onSelectPoint(pt)}
              >
                {/* Outer halo for high uncertainty or outliers */}
                {pt.isOutlier && (
                  <circle cx={coords.x} cy={coords.y} r="12" fill="#F59E0B" fillOpacity="0.25" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2,2" />
                )}

                {/* Pulsing reticle if current investigated case */}
                {isHighlight && (
                  <>
                    <circle cx={coords.x} cy={coords.y} r="18" fill="none" stroke="#60A5FA" strokeWidth="1.5" className="animate-ping" opacity="0.75" />
                    <circle cx={coords.x} cy={coords.y} r="14" fill="#3B82F6" fillOpacity="0.2" stroke="#60A5FA" strokeWidth="2" />
                    <line x1={coords.x - 20} y1={coords.y} x2={coords.x + 20} y2={coords.y} stroke="#60A5FA" strokeWidth="1" strokeDasharray="2,2" />
                    <line x1={coords.x} y1={coords.y - 20} x2={coords.x} y2={coords.y + 20} stroke="#60A5FA" strokeWidth="1" strokeDasharray="2,2" />
                  </>
                )}

                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={isHighlight ? 7 : pt.isOutlier ? 6 : 4.5}
                  fill={isHighlight ? '#3B82F6' : fillColor}
                  stroke={isHighlight ? '#FFFFFF' : '#0F172A'}
                  strokeWidth="1.5"
                />
              </g>
            );
          })}
        </svg>

        {/* Hovered Point Tooltip */}
        {hoveredPoint && (
          <div className="absolute top-3 left-4 bg-slate-900/95 backdrop-blur-md border border-slate-700 text-white rounded-lg p-2.5 text-xs shadow-elevated z-20 pointer-events-none">
            <p className="font-semibold text-slate-100">{hoveredPoint.merchant}</p>
            <div className="mt-1 flex items-center gap-3 text-slate-300">
              <span>Amount: <strong className="text-white">${hoveredPoint.amount.toFixed(2)}</strong></span>
              <span>Truth: <strong className={hoveredPoint.label === 'FRAUD' ? 'text-rose-400' : 'text-emerald-400'}>{hoveredPoint.label}</strong></span>
              <span>Uncertainty: <strong className="text-purple-300">{(hoveredPoint.uncertainty * 100).toFixed(0)}%</strong></span>
            </div>
          </div>
        )}

        {/* Legend Overlay */}
        <div className="absolute bottom-2.5 right-3 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-md border border-slate-800 text-[11px] text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Legitimate
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Fraud Cluster
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Uncertain (Conformal)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-blue-300" /> Current Case
          </span>
        </div>
      </div>
    </div>
  );
};

