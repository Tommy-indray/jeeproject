import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Search, Download, Filter, ScrollText, ChevronDown, ChevronUp } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export const AdminAuditExplorer: React.FC = () => {
  const { audits } = useData();
  const { showToast } = useNotification();

  const [search, setSearch] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const filtered = audits.filter(a => 
    a.actor.toLowerCase().includes(search.toLowerCase()) ||
    a.action.toLowerCase().includes(search.toLowerCase()) ||
    a.entity.toLowerCase().includes(search.toLowerCase()) ||
    a.correlationId.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['EventID', 'Timestamp', 'Actor', 'Action', 'Entity', 'EntityID', 'Result', 'CorrelationID'];
    const rows = filtered.map(a => [
      a.id,
      a.timestamp,
      `"${a.actor}"`,
      a.action,
      a.entity,
      a.entityId,
      a.result,
      a.correlationId
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vigilia-audit-export-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('success', 'Audit Exported', 'Downloaded compliance CSV report.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Audit & Compliance Explorer</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-navy-100 text-navy-800">
              IMMUTABLE JOURNAL
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete compliance trail satisfying GDPR & financial auditing mandates for every automated and human decision.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="bg-surface hover:bg-slate-50 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-navy-800" />
          Export Audit CSV
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-surface rounded-card border border-slate-200 p-4 shadow-subtle flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search actor, action, entity, correlation ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
          />
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Showing {filtered.length} events
        </span>
      </div>

      {/* Audit Log Table */}
      <div className="bg-surface rounded-card border border-slate-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold">
                <th className="py-3 px-5">Timestamp (UTC)</th>
                <th className="py-3 px-5">Action</th>
                <th className="py-3 px-5">Actor</th>
                <th className="py-3 px-5">Entity</th>
                <th className="py-3 px-5">Result</th>
                <th className="py-3 px-5">Correlation ID</th>
                <th className="py-3 px-5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map(a => {
                const isExpanded = selectedEventId === a.id;

                return (
                  <React.Fragment key={a.id}>
                    <tr 
                      onClick={() => setSelectedEventId(isExpanded ? null : a.id)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-5 font-mono text-slate-500">
                        {new Date(a.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-5 font-bold font-mono text-navy-800">
                        {a.action}
                      </td>
                      <td className="py-3 px-5 font-medium text-slate-800">
                        {a.actor}
                      </td>
                      <td className="py-3 px-5 text-slate-600">
                        {a.entity} ({a.entityId})
                      </td>
                      <td className="py-3 px-5">
                        <StatusBadge status={a.result} size="sm" />
                      </td>
                      <td className="py-3 px-5 font-mono text-[11px] text-slate-400">
                        {a.correlationId}
                      </td>
                      <td className="py-3 px-5 text-right text-slate-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
                      </td>
                    </tr>

                    {/* Expandable Diff & JSON row */}
                    {isExpanded && (
                      <tr className="bg-slate-50/90 border-b border-slate-100">
                        <td colSpan={7} className="p-4">
                          <div className="space-y-2 text-xs">
                            {a.diff && (
                              <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-900 font-mono text-[11px]">
                                State Transition [{a.diff.field}]: <span className="line-through text-rose-600">{a.diff.before}</span> &rarr; <span className="text-emerald-700 font-bold">{a.diff.after}</span>
                              </div>
                            )}
                            <div className="bg-white p-3 rounded-lg border border-slate-200">
                              <span className="font-semibold text-slate-700 block mb-1">Payload Snapshot:</span>
                              <pre className="font-mono text-[11px] text-slate-600 overflow-x-auto">
                                {JSON.stringify(a.details || a, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

