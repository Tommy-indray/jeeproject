import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  HelpCircle, 
  Check, 
  X,
  CreditCard,
  MapPin,
  FileText
} from 'lucide-react';

export const CustomerTransactionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { transactions, submitFeedback } = useData();
  const navigate = useNavigate();

  const tx = transactions.find(t => t.id === id) || transactions[0];
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<string | null>(tx?.customerFeedback || null);

  const handleFeedback = async (val: 'CONFIRMED_LEGITIMATE' | 'REPORTED_FRAUD') => {
    if (!tx) return;
    await submitFeedback(tx.id, val);
    setFeedbackSubmitted(val);
  };

  if (!tx) {
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        Transaction record not found. <button onClick={() => navigate('/customer/transactions')} className="text-brand-blue underline">Back</button>
      </div>
    );
  }

  // Calculate timeline steps
  const steps = [
    { name: 'Payment Received', done: true, time: new Date(tx.timestamp).toLocaleTimeString() },
    { name: 'Security Check', done: true, time: 'Automated ML validation completed' },
    { 
      name: tx.status === 'PENDING_REVIEW' ? 'Under Analyst Review' : tx.status === 'REJECTED' ? 'Blocked by Security' : 'Authorized & Settled', 
      done: true, 
      active: tx.status === 'PENDING_REVIEW',
      color: tx.status === 'REJECTED' ? 'rose' : tx.status === 'PENDING_REVIEW' ? 'amber' : 'emerald'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/customer/transactions')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to all transactions
      </button>

      {/* Main Status Header Card */}
      <div className="bg-surface rounded-card border border-slate-200 p-6 shadow-subtle">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-medium text-slate-400">Transaction Status Tracker</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">{tx.merchant}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Authorized on {new Date(tx.timestamp).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Total Charged</span>
            <p className="text-3xl font-extrabold text-slate-900">${tx.amount.toFixed(2)}</p>
            <div className="mt-1 flex justify-end">
              <StatusBadge status={tx.status} size="lg" />
            </div>
          </div>
        </div>

        {/* Plain Language Explanation */}
        <div className="py-4 text-xs text-slate-600 leading-relaxed">
          {tx.status === 'PENDING_REVIEW' && (
            <p className="bg-amber-50 text-amber-900 p-3.5 rounded-xl border border-amber-200">
              <strong>Why was this transaction held?</strong> This checkout occurred outside your regular purchasing patterns (unusual location distance or high amount). Our fraud safety system temporarily placed it under security review.
            </p>
          )}
          {tx.status === 'APPROVED' && (
            <p className="bg-emerald-50 text-emerald-900 p-3.5 rounded-xl border border-emerald-200">
              <strong>Protected & Cleared:</strong> This payment satisfied all cardholder security checks and was verified instantly with 3DS 2.0 authentication.
            </p>
          )}
          {tx.status === 'REJECTED' && (
            <p className="bg-rose-50 text-rose-900 p-3.5 rounded-xl border border-rose-200">
              <strong>Transaction Declined:</strong> This transaction triggered severe fraud signals (known proxy/anonymizer and high velocity). Your card balance was not debited.
            </p>
          )}
        </div>

        {/* Timeline Progression Tracker */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-800 mb-4 uppercase tracking-wider">Verification Stages</p>
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {steps.map((st, i) => (
              <div key={i} className="relative">
                <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-white ${
                  st.active ? 'bg-amber-500 border-amber-200 animate-pulse' :
                  st.color === 'rose' ? 'bg-rose-500 border-rose-200' : 'bg-emerald-500 border-emerald-200'
                }`}>
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{st.name}</p>
                  <p className="text-[11px] text-slate-400">{st.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* "Was This You?" Customer Response Box */}
      {tx.status === 'PENDING_REVIEW' && (
        <div className="bg-surface rounded-card border-2 border-brand-blue/30 p-6 shadow-card">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
            <div className="w-full">
              <h3 className="text-sm font-bold text-slate-900">Was this payment made by you?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your response is instantly recorded as verified evidence for our risk analysts.
              </p>

              {feedbackSubmitted ? (
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                  <span>
                    Your confirmation has been saved: <strong className={feedbackSubmitted === 'CONFIRMED_LEGITIMATE' ? 'text-emerald-700' : 'text-rose-700'}>
                      {feedbackSubmitted === 'CONFIRMED_LEGITIMATE' ? 'Yes, I made this purchase' : 'No, I did not make this purchase'}
                    </strong>
                  </span>
                  <StatusBadge status={feedbackSubmitted} size="sm" />
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => handleFeedback('CONFIRMED_LEGITIMATE')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    Yes, it was me
                  </button>
                  <button
                    onClick={() => handleFeedback('REPORTED_FRAUD')}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <X className="w-4 h-4" />
                    No, lock my card
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Security Context details */}
      <div className="bg-surface rounded-card border border-slate-200 p-5 shadow-subtle text-xs space-y-2.5">
        <h4 className="font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-500" />
          Technical Receipt Metadata
        </h4>
        <div className="grid grid-cols-2 gap-2 text-slate-600 pt-2 border-t border-slate-100">
          <div><span className="text-slate-400">Card Mask:</span> {tx.cardType} **** {tx.cardLast4}</div>
          <div><span className="text-slate-400">Location:</span> {tx.merchantLocation.city}, {tx.merchantLocation.country}</div>
          <div><span className="text-slate-400">Separation Distance:</span> {tx.distanceKm} km</div>
          <div><span className="text-slate-400">Audit Trace:</span> <code className="font-mono text-[10px]">{tx.correlationId}</code></div>
        </div>
      </div>
    </div>
  );
};

