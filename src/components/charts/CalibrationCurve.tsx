import React from 'react';
import { CalibrationPoint } from '../../types/contracts';
import { MOCK_CALIBRATION_CURVE } from '../../services/mockData';
import { Activity, ShieldCheck } from 'lucide-react';

interface CalibrationCurveProps {
  data?: CalibrationPoint[];
  brierScore?: number;
}

export const CalibrationCurve: React.FC<CalibrationCurveProps> = ({
  data = MOCK_CALIBRATION_CURVE,
  brierScore = 0.0028
}) => {
  // Map (0.0 - 1.0) to SVG canvas (300 x 240)
  const mapPoint = (x: number, y: number) => {
    return {
      x: 35 + x * 240,
      y: 205 - y * 180
    };
  };

  const pointsString = data
    .map(pt => {
      const { x, y } = mapPoint(pt.meanPredicted, pt.fractionOfPositives);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="bg-surface rounded-card border border-slate-200 p-5 shadow-subtle">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-600" />
            Reliability Diagram — Probability Calibration
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Compares predicted confidence levels against true empirical fraud frequencies
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-slate-400">Brier Score</span>
          <p className="text-sm font-bold font-mono text-emerald-600">{brierScore.toFixed(4)}</p>
        </div>
      </div>

      <div className="relative mt-4 h-56 bg-slate-50/60 rounded-lg p-2 border border-slate-200/80">
        <svg className="w-full h-full" viewBox="0 0 300 240">
          {/* Axis lines */}
          <line x1="35" y1="205" x2="285" y2="205" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="35" y1="25" x2="35" y2="205" stroke="#94A3B8" strokeWidth="1.5" />

          {/* Grid lines */}
          <line x1="35" y1="115" x2="285" y2="115" stroke="#E2E8F0" strokeDasharray="3,3" />
          <line x1="160" y1="25" x2="160" y2="205" stroke="#E2E8F0" strokeDasharray="3,3" />

          {/* 45-degree Perfect Calibration Line */}
          <line x1="35" y1="205" x2="275" y2="25" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4,4" />

          {/* Model Calibration Curve */}
          <polyline
            fill="none"
            stroke="#2563EB"
            strokeWidth="2.5"
            points={pointsString}
          />

          {/* Calibration Points */}
          {data.map(pt => {
            const { x, y } = mapPoint(pt.meanPredicted, pt.fractionOfPositives);
            return (
              <circle
                key={pt.bin}
                cx={x}
                cy={y}
                r="4.5"
                fill="#2563EB"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Labels */}
          <text x="35" y="222" fontSize="9" fill="#64748B" textAnchor="middle">0.0</text>
          <text x="160" y="222" fontSize="9" fill="#64748B" textAnchor="middle">0.5</text>
          <text x="275" y="222" fontSize="9" fill="#64748B" textAnchor="middle">1.0</text>
          <text x="20" y="208" fontSize="9" fill="#64748B" textAnchor="end">0.0</text>
          <text x="20" y="118" fontSize="9" fill="#64748B" textAnchor="end">0.5</text>
          <text x="20" y="28" fontSize="9" fill="#64748B" textAnchor="end">1.0</text>
        </svg>

        <div className="absolute top-2.5 right-4 flex items-center gap-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-slate-400 border-dashed" /> Perfect (45°)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600" /> XGBoost Calibrated
          </span>
        </div>
      </div>
    </div>
  );
};

