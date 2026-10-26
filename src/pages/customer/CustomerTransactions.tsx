import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Search, Filter, ShoppingBag, ArrowRight, X } from 'lucide-react';
import { Transaction } from '../../types/contracts';

export const CustomerTransactions: React.FC = () => {
  const { transactions } = useData();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filtered = transactions.filter(tx => {
    const matchesSearch = tx.merchant.toLowerCase().includes(search.toLowerCase()) || 
                          tx.id.toLowerCase().includes(search.toLowerCase()) ||
                          tx.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || tx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Transaction History</h2>
        <p className="text-xs text-slate-500 mt-1">
          Review all payments and real-time fraud supervision records.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface rounded-card border border-slate-200 p-4 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search merchant, ID, category..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex items-center gap-1 text-xs">
            {['ALL', 'APPROVED', 'PENDING_REVIEW', 'REJECTED'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${statusFilter === st ? 'bg-navy-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                {st === 'ALL' ? 'All' : st === 'PENDING_REVIEW' ? 'Under Review' : st === 'APPROVED' ? 'Approved' : 'Declined'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-card border border-slate-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold">
                <th className="py-3 px-6">Transaction ID</th>
                <th className="py-3 px-6">Merchant & Category</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Amount</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map(tx => (
                <tr 
                  key={tx.id} 
                  onClick={() => setSelectedTx(tx)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-6 font-mono text-slate-500 font-medium">
                    {tx.id}
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{tx.merchant}</p>
                        <p className="text-[11px] text-slate-400">{tx.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-slate-500">
                    {new Date(tx.timestamp).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-slate-900">
                    ${tx.amount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-6">
                    <StatusBadge status={tx.status} />
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/customer/transactions/${tx.id}`);
                      }}
                      className="text-brand-blue hover:text-brand-dark font-medium inline-flex items-center gap-1"
                    >
                      Tracker
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer if row clicked */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-surface h-full shadow-elevated p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Transaction Details</h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedTx.id}</p>
                </div>
                <button onClick={() => setSelectedTx(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 space-y-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400">Total Charged</span>
                    <p className="text-2xl font-bold text-slate-900">${selectedTx.amount.toFixed(2)}</p>
                  </div>
                  <StatusBadge status={selectedTx.status} size="lg" />
                </div>

                <div className="space-y-2.5 pt-2">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Merchant</span>
                    <span className="font-semibold text-slate-900">{selectedTx.merchant}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Category</span>
                    <span className="font-medium text-slate-800">{selectedTx.category}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Card Used</span>
                    <span className="font-mono text-slate-800">{selectedTx.cardType} (**** {selectedTx.cardLast4})</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Merchant Location</span>
                    <span className="text-slate-800">{selectedTx.merchantLocation.city}, {selectedTx.merchantLocation.country}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Distance from registered home</span>
                    <span className="text-slate-800 font-mono">{selectedTx.distanceKm} km</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Security Correlation ID</span>
                    <span className="font-mono text-[11px] text-slate-400">{selectedTx.correlationId}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <button
                onClick={() => {
                  navigate(`/customer/transactions/${selectedTx.id}`);
                  setSelectedTx(null);
                }}
                className="w-full bg-navy-800 hover:bg-navy-900 text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              >
                Open Full Status Tracker & Verification
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

