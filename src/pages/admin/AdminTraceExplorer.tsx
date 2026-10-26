import React, { useState } from 'react';
import { MOCK_TRACES } from '../../services/mockData';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Search, GitBranch, Clock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AdminTraceExplorer: React.FC = () => {
  const [search, setSearch] = useState('c-8f12a9-e31b-4b');
  const [selectedTrace, setSelectedTrace] = useState(MOCK_TRACES[0]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = MOCK_TRACES.find(t => 
      t.correlationId.toLowerCase().includes(search.toLowerCase()) ||
      t.traceId.toLowerCase().includes(search.toLowerCase())
    );
    if (found) setSelectedTrace(found);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Distributed Trace Explorer</h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-navy-100 text-navy-800">
            X-CORRELATION-ID
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Follow asynchronous transaction journeys across API Gateway, Spring Boot microservices, and FastAPI ML inference.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="bg-surface rounded-card border border-slate-200 p-4 shadow-subtle flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Enter X-Correlation-ID or Trace ID (e.g. c-8f12a9-e31b-4b)..."
          className="w-full text-xs text-slate-900 outline-none placeholder:text-slate-400 font-mono"
        />
        <button
          type="submit"
          className="bg-navy-800 hover:bg-navy-900 text-white px-4 py-1.5 rounded-lg text-xs font-semibold"
        >
          Inspect Trace
        </button>
      </form>

      {/* Trace Overview Card */}
      <div className="bg-surface rounded-card border border-slate-200 p-6 shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm font-mono">{selectedTrace.endpoint}</span>
              <StatusBadge status={selectedTrace.status} size="sm" />
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Trace: {selectedTrace.traceId} &bull; Correlation: {selectedTrace.correlationId}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400">Total Roundtrip Duration</span>
            <p className="text-xl font-black text-navy-800 font-mono">{selectedTrace.totalDurationMs} ms</p>
          </div>
        </div>

        {/* Distributed Waterfall Diagram */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-brand-blue" />
            Span Waterfall Execution Flow
          </h4>

          <div className="space-y-3">
            {selectedTrace.spans.map((span, idx) => {
              // Calculate horizontal position and width percentages
              const leftPct = (span.offsetMs / selectedTrace.totalDurationMs) * 100;
              const widthPct = Math.max(8, (span.durationMs / selectedTrace.totalDurationMs) * 100);

              return (
                <div key={idx} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                        {span.service}
                      </span>
                      <span className="text-slate-700 font-medium">{span.operation}</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-slate-400">HTTP {span.httpStatus}</span>
                      <span className="font-bold text-slate-800">{span.durationMs} ms</span>
                    </div>
                  </div>

                  {/* Waterfall Bar Track */}
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
                    <div
                      className="absolute top-0 bottom-0 bg-brand-blue rounded-full opacity-90 transition-all duration-300"
                      style={{
                        left: `${leftPct}%`,
                        width: `${widthPct}%`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

