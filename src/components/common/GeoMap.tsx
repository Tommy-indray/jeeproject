import React from 'react';
import { MapPin, Navigation, Compass, Globe } from 'lucide-react';
import { GeoLocation } from '../../types/contracts';

interface GeoMapProps {
  home: GeoLocation;
  merchant: GeoLocation;
  distanceKm: number;
  ipAddress?: string;
}

export const GeoMap: React.FC<GeoMapProps> = ({ home, merchant, distanceKm, ipAddress }) => {
  // Normalize US coordinates to SVG 0-100% canvas space
  const projectToCanvas = (lat: number, lon: number) => {
    // US approx bounding box: Lat 24 to 50, Lon -125 to -66
    const minLat = 24;
    const maxLat = 50;
    const minLon = -125;
    const maxLon = -66;

    const x = ((lon - minLon) / (maxLon - minLon)) * 520 + 40;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 240 + 30;
    return { x: Math.max(30, Math.min(570, x)), y: Math.max(20, Math.min(280, y)) };
  };

  const homePt = projectToCanvas(home.lat, home.lon);
  const merchPt = projectToCanvas(merchtLocationLat(merchant.lat), merchant.lon);

  function merchtLocationLat(lat: number) {
    return lat;
  }

  // Curved arc control point
  const midX = (homePt.x + merchPt.x) / 2;
  const midY = (homePt.y + merchPt.y) / 2 - 40;

  return (
    <div className="bg-surface rounded-card border border-slate-200 overflow-hidden shadow-subtle">
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-navy-800" />
          <h4 className="text-sm font-semibold text-slate-800">Geographic & IP Risk Context</h4>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 font-medium border border-amber-200">
            {distanceKm.toLocaleString()} km separation
          </span>
        </div>
      </div>

      <div className="relative h-64 bg-slate-900 overflow-hidden">
        {/* Subtle grid backdrop */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(#60A5FA 1px, transparent 1px), radial-gradient(#60A5FA 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px'
          }}
        />

        {/* SVG Arc and Pins */}
        <svg className="w-full h-full" viewBox="0 0 600 300">
          <defs>
            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Curved trajectory path */}
          <path
            d={`M ${homePt.x} ${homePt.y} Q ${midX} ${midY} ${merchPt.x} ${merchPt.y}`}
            fill="none"
            stroke="url(#arcGradient)"
            strokeWidth="2.5"
            strokeDasharray="6,4"
            filter="url(#glow)"
            className="animate-pulse"
          />

          {/* Home node */}
          <circle cx={homePt.x} cy={homePt.y} r="14" fill="#10B981" fillOpacity="0.2" />
          <circle cx={homePt.x} cy={homePt.y} r="6" fill="#10B981" />

          {/* Merchant node */}
          <circle cx={merchPt.x} cy={merchPt.y} r="18" fill="#EF4444" fillOpacity="0.25" className="animate-ping" />
          <circle cx={merchPt.x} cy={merchPt.y} r="8" fill="#EF4444" />
        </svg>

        {/* Home Pin Label */}
        <div 
          className="absolute z-10 -translate-x-1/2 -translate-y-full mb-2 pointer-events-none"
          style={{ left: `${(homePt.x / 600) * 100}%`, top: `${(homePt.y / 300) * 100}%` }}
        >
          <div className="bg-emerald-950/90 text-emerald-300 border border-emerald-600/50 text-[11px] font-medium px-2 py-1 rounded shadow-lg flex items-center gap-1 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Home: {home.city}, {home.country}
          </div>
        </div>

        {/* Merchant Pin Label */}
        <div 
          className="absolute z-10 -translate-x-1/2 -translate-y-full mb-2 pointer-events-none"
          style={{ left: `${(merchPt.x / 600) * 100}%`, top: `${(merchPt.y / 300) * 100}%` }}
        >
          <div className="bg-rose-950/90 text-rose-300 border border-rose-600/50 text-[11px] font-medium px-2 py-1 rounded shadow-lg flex items-center gap-1 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Merchant: {merchant.city}, {merchant.country}
          </div>
        </div>

        {/* Overlay Footer Info */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-300 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-lg border border-slate-800">
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>IP: <code className="text-white font-mono">{ipAddress || '198.51.100.42'}</code></span>
          </div>
          <div className="flex items-center gap-2">
            <Navigation className="w-3.5 h-3.5 text-amber-400" />
            <span>Speed required: <strong className="text-amber-300 font-semibold">&gt; 1,800 km/h</strong> (Impossible travel)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

