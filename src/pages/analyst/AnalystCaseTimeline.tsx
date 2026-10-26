import React from 'react';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { History, Shield, Clock, FileText, User, ArrowRight } from 'lucide-react';

export const AnalystCaseTimeline: React.FC = () => {
  const { audits } = useData();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Case Timeline & Forensic Evidence</h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-navy-100 text-navy-800">
            AUDIT TRAIL
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Cryptographically immutable audit records capturing automated inference, customer verification, and analyst interventions.
        </p>
      </div>

      <div className="bg-surface rounded-card border border-slate-200 p-6 shadow-subtle">
        <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {audits.map(event => (
            <div key={event.id} className="relative text-xs">
              {/* Event circle icon */}
              <div className="absolute -left-8 top-0.5 w-6 h-6 rounded-full bg-surface border-2 border-brand-blue flex items-center justify-center text-brand-blue shadow-sm">
                <Clock className="w-3 h-3" />
              </div>

              <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-200/50">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 font-mono">{event.action}</span>
                    <StatusBadge status={event.result} size="sm" />
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Actor</span>
                    <span className="font-medium text-slate-800">{event.actor}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Entity</span>
                    <span className="font-medium text-slate-800">{event.entity} ({event.entityId})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Trace Correlation</span>
                    <code className="text-brand-blue text-[10px] font-mono">{event.correlationId}</code>
                  </div>
                </div>

                {event.diff && (
                  <div className="mt-3 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/60 font-mono text-[11px] text-amber-900">
                    State Transition [{event.diff.field}]: <span className="line-through text-rose-600">{event.diff.before}</span> &rarr; <span className="text-emerald-700 font-bold">{event.diff.after}</span>
                  </div>
                )}

                {event.details && (
                  <div className="mt-2 text-[11px] text-slate-500 bg-white p-2.5 rounded-lg border border-slate-100">
                    <pre className="font-mono overflow-x-auto">{JSON.stringify(event.details, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

