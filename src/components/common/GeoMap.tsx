import React from 'react';
import { Compass, Globe, Navigation, ShieldAlert, Plane } from 'lucide-react';
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
    const minLat = 24;
    const maxLat = 50;
    const minLon = -125;
    const maxLon = -66;

    const x = ((lon - minLon) / (maxLon - minLon)) * 520 + 40;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 240 + 30;
    return { x: Math.max(40, Math.min(560, x)), y: Math.max(30, Math.min(270, y)) };
  };

  const homePt = projectToCanvas(home.lat, home.lon);
  const merchPt = projectToCanvas(merchant.lat, merchant.lon);

  // Curved arc control point
  const midX = (homePt.x + merchPt.x) / 2;
  const midY = (homePt.y + merchPt.y) / 2 - 45;

  return (
    <div className="bg-surface rounded-card border border-slate-200 overflow-hidden shadow-card">
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-navy-50 text-navy-800">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Geospatial Velocity & Impossible Travel Check</h4>
            <p className="text-[10px] text-slate-500">Real-time GPS triangulation between cardholder residence & terminal</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-bold border border-amber-200/80 flex items-center gap-1.5 shadow-xs">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            {distanceKm.toLocaleString()} km separation
          </span>
        </div>
      </div>

      <div className="relative h-72 bg-gradient-to-b from-slate-950 via-slate-900 to-navy-950 overflow-hidden select-none">
        {/* Radar concentric circular grid */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-96 h-96 rounded-full border border-blue-400" />
          <div className="w-64 h-64 rounded-full border border-blue-400 absolute" />
          <div className="w-32 h-32 rounded-full border border-blue-400 absolute" />
        </div>

        {/* Matrix coordinate grid */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(#60A5FA 1px, transparent 1px), radial-gradient(#60A5FA 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px'
          }}
        />

        {/* SVG Arc, Flight Path & Pins */}
        <svg className="w-full h-full" viewBox="0 0 600 300">
          <defs>
            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>

            <filter id="glowEffect">
              <feGaussianBlur stdDeviation="3.5" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Curved trajectory path with glow */}
          <path
            id="flightTrajectory"
            d={`M ${homePt.x} ${homePt.y} Q ${midX} ${midY} ${merchPt.x} ${merchPt.y}`}
            fill="none"
            stroke="url(#arcGradient)"
            strokeWidth="3"
            strokeDasharray="6,4"
            filter="url(#glowEffect)"
          />

          {/* Animated Gliding Transfer Dot */}
          <circle r="4" fill="#FFFFFF" filter="url(#glowEffect)">
            <animateMotion
              dur="3.5s"
              repeatCount="indefinite"
              path={`M ${homePt.x} ${homePt.y} Q ${midX} ${midY} ${merchPt.x} ${merchPt.y}`}
            />
          </circle>

          {/* Home node with soft halo */}
          <circle cx={homePt.x} cy={homePt.y} r="20" fill="#10B981" fillOpacity="0.15" />
          <circle cx={homePt.x} cy={homePt.y} r="10" fill="#10B981" fillOpacity="0.4" />
          <circle cx={homePt.x} cy={homePt.y} r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />

          {/* Merchant node with pulsing alert halo */}
          <circle cx={merchPt.x} cy={merchPt.y} r="28" fill="#EF4444" fillOpacity="0.2" className="animate-ping" />
          <circle cx={merchPt.x} cy={merchPt.y} r="14" fill="#EF4444" fillOpacity="0.4" />
          <circle cx={merchPt.x} cy={merchPt.y} r="6" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
        </svg>

        {/* Home Pin Label */}
        <div 
          className="absolute z-10 -translate-x-1/2 -translate-y-full mb-3 pointer-events-none"
          style={{ left: `${(homePt.x / 600) * 100}%`, top: `${(homePt.y / 300) * 100}%` }}
        >
          <div className="bg-slate-900/90 backdrop-blur-md text-emerald-400 border border-emerald-500/50 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-elevated flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Home: {home.city}, {home.country}
          </div>
        </div>

        {/* Merchant Pin Label */}
        <div 
          className="absolute z-10 -translate-x-1/2 -translate-y-full mb-3 pointer-events-none"
          style={{ left: `${(merchPt.x / 600) * 100}%`, top: `${(merchPt.y / 300) * 100}%` }}
        >
          <div className="bg-slate-900/90 backdrop-blur-md text-rose-300 border border-rose-500/50 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-elevated flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            Terminal: {merchant.city}, {merchant.country}
          </div>
        </div>

        {/* High-Tech Telemetry Overlay Card */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between text-xs text-slate-300 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800 shadow-elevated gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>IP: <code className="text-white font-mono font-bold text-xs">{ipAddress || '198.51.100.42'}</code></span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-[11px] text-slate-400">Proxy/VPN: <strong className="text-emerald-400">Clean Residential</strong></span>
          </div>

          <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-xs">
            <Navigation className="w-3.5 h-3.5 text-amber-400" />
            <span>Velocity: <strong className="text-white font-mono">&gt;1,850 km/h</strong> (Impossible travel trigger)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
