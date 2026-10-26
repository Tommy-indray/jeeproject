import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { GeoMap } from '../../components/common/GeoMap';
import { ShapWaterfall } from '../../components/charts/ShapWaterfall';
import { UmapScatterPlot } from '../../components/charts/UmapScatterPlot';
import { 
  ArrowLeft, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  User, 
  MapPin, 
  Activity, 
  AlertTriangle,
  History,
  Cpu,
  GitFork,
  Check,
  Send,
  HelpCircle,
  Sparkles,
  Command
} from 'lucide-react';
import { DecisionReasonCode } from '../../types/contracts';

export const AnalystCaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { cases, resolveCase } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Find target case or fallback to the signature case
  const currentCase = cases.find(c => c.id === id || c.transactionId === id) || cases[0];

  const [activeTab, setActiveTab] = useState<'WORKSPACE' | 'SHAP' | 'SIMILAR' | 'TIMELINE'>('WORKSPACE');
  const [decision, setDecision] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [reasonCode, setReasonCode] = useState<DecisionReasonCode>('Customer confirmed');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const tx = currentCase.transaction;
  const prediction = tx.prediction;

  // Keyboard shortcut listener for SOC analysts (A: Approve, R: Reject)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in textarea or input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.key === 'a' || e.key === 'A') {
        setDecision('APPROVED');
      } else if (e.key === 'r' || e.key === 'R') {
        setDecision('REJECTED');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await resolveCase(currentCase.id, {
        decision,
        reasonCode,
        notes,
        analystName: currentUser.name
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Live Case Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <button
          onClick={() => navigate('/analyst/queue')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-navy-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Investigation Queue
        </button>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="px-2.5 py-1 rounded-lg bg-navy-50 text-navy-800 font-mono font-bold text-xs border border-navy-100">
            Case: {currentCase.id}
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-slate-400 font-mono text-[11px]">
            Trace: <code className="text-slate-700 font-bold">{tx.correlationId}</code>
          </span>
          <StatusBadge status={currentCase.status === 'RESOLVED' ? (currentCase.resolution?.decision || 'RESOLVED') : currentCase.priority} size="sm" />
        </div>
      </div>

      {/* 3-ZONE SIGNATURE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= ZONE 1: LEFT / CONTEXT (3 cols) ================= */}
        <div className="lg:col-span-3 space-y-4">
          {/* Customer Profile Card */}
          <div className="bg-surface rounded-2xl border border-slate-200 p-4.5 shadow-subtle text-xs">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-navy-800 to-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                  <User className="w-6 h-6" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{tx.customerName}</p>
                <p className="text-[10px] text-slate-400 font-mono font-semibold">ID: {tx.customerId}</p>
              </div>
            </div>

            <div className="mt-3.5 space-y-2 text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Home Residence</span>
                <span className="font-bold text-slate-800">{tx.customerHomeLocation.city}, {tx.customerHomeLocation.country}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Cardholder Tier</span>
                <span className="font-bold text-emerald-600">Tier 1 Platinum</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Account Age</span>
                <span className="font-bold text-slate-800">4.8 years</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Past Delinquency</span>
                <span className="font-bold text-emerald-600 font-mono">0 alerts</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-medium">90d Average Spend</span>
                <span className="font-bold text-slate-800 font-mono">$288.40 / tx</span>
              </div>
            </div>
          </div>

          {/* Customer "Was This You?" Response Evidence */}
          <div className="bg-surface rounded-2xl border border-slate-200 p-4.5 shadow-subtle text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
              <HelpCircle className="w-4 h-4 text-brand-blue" />
              Customer Verification
            </div>
            {tx.customerFeedback ? (
              <div className="mt-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <p className="font-bold">Cardholder Verified via App:</p>
                <p className="text-[11px] mt-0.5 italic">
                  &ldquo;{tx.customerFeedback === 'CONFIRMED_LEGITIMATE' ? 'Yes, I made this purchase' : 'Fraud reported by customer'}&rdquo;
                </p>
              </div>
            ) : (
              <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 italic text-[11px]">
                No customer response yet. Dispatched SMS prompt.
              </div>
            )}
          </div>

          {/* Quick Queue Switcher */}
          <div className="bg-surface rounded-2xl border border-slate-200 p-4.5 shadow-subtle text-xs">
            <p className="font-bold text-slate-800 mb-2.5 uppercase tracking-wider text-[10px]">
              Other Priority Cases
            </p>
            <div className="space-y-1.5">
              {cases.slice(0, 4).map(c => (
                <Link
                  key={c.id}
                  to={`/analyst/cases/${c.id}`}
                  className={`p-2.5 rounded-xl flex items-center justify-between transition-all ${
                    c.id === currentCase.id 
                      ? 'bg-navy-800 text-white font-bold shadow-xs' 
                      : 'hover:bg-slate-50 text-slate-700 border border-slate-100'
                  }`}
                >
                  <span className="font-mono">{c.id}</span>
                  <span className="font-mono font-bold">${c.transaction.amount.toFixed(0)}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ================= ZONE 2: CENTER / EVIDENCE (6 cols) ================= */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Header Summary Banner */}
          <div className="bg-surface rounded-2xl border border-slate-200 p-6 shadow-subtle">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  FLIGHT RISK & TRANSACTION DETAILS
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">{tx.merchant}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Category: <strong>{tx.category}</strong> &bull; Card: {tx.cardType} (**** {tx.cardLast4})
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Authorization Value</span>
                <p className="text-3xl font-black text-slate-900 font-mono">${tx.amount.toFixed(2)}</p>
              </div>
            </div>

            {/* Evidence Sub-Tabs */}
            <div className="flex items-center gap-1.5 mt-4 border-b border-slate-100 pb-3 text-xs font-bold">
              <button
                onClick={() => setActiveTab('WORKSPACE')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'WORKSPACE' ? 'bg-navy-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Workspace & Map
              </button>
              <button
                onClick={() => setActiveTab('SHAP')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'SHAP' ? 'bg-navy-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" /> SHAP Attribution
              </button>
              <button
                onClick={() => setActiveTab('SIMILAR')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'SIMILAR' ? 'bg-navy-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <GitFork className="w-3.5 h-3.5" /> Similar Cases & UMAP
              </button>
              <button
                onClick={() => setActiveTab('TIMELINE')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'TIMELINE' ? 'bg-navy-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <History className="w-3.5 h-3.5" /> Forensic Trail
              </button>
            </div>

            {/* TAB CONTENT: WORKSPACE */}
            {activeTab === 'WORKSPACE' && (
              <div className="mt-4 space-y-4">
                {/* Advanced ML Risk Score Ribbon */}
                {prediction && (
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50/30 border border-slate-200/90 rounded-2xl p-4 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">FastAPI Prediction</span>
                      <p className="font-black text-rose-600 font-mono text-base mt-0.5">
                        {prediction.prediction} ({(prediction.probability * 100).toFixed(1)}%)
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">{prediction.model_version}</p>
                    </div>

                    <div className="text-center px-4 border-x border-slate-200">
                      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Conformal Uncertainty</span>
                      <p className="font-black text-purple-700 font-mono text-base mt-0.5">
                        ±{(prediction.uncertainty * 100).toFixed(1)}%
                      </p>
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        Review Triggered (&gt;35%)
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Inference Speed</span>
                      <p className="font-black text-slate-900 font-mono text-base mt-0.5">{prediction.inference_time_ms} ms</p>
                      <span className="text-[10px] text-emerald-600 font-semibold font-mono">100% Calibrated</span>
                    </div>
                  </div>
                )}

                {/* Interactive Animated Map */}
                <GeoMap
                  home={tx.customerHomeLocation}
                  merchant={tx.merchantLocation}
                  distanceKm={tx.distanceKm}
                  ipAddress={tx.ipAddress}
                />

                {/* Compact SHAP Preview */}
                {prediction?.explanation && (
                  <ShapWaterfall
                    baseValue={prediction.explanation.base_value}
                    finalScore={prediction.probability}
                    features={prediction.explanation.top_features}
                  />
                )}
              </div>
            )}

            {/* TAB CONTENT: SHAP FULL */}
            {activeTab === 'SHAP' && prediction?.explanation && (
              <div className="mt-4">
                <ShapWaterfall
                  baseValue={prediction.explanation.base_value}
                  finalScore={prediction.probability}
                  features={prediction.explanation.top_features}
                />
              </div>
            )}

            {/* TAB CONTENT: SIMILAR & UMAP */}
            {activeTab === 'SIMILAR' && (
              <div className="mt-4">
                <UmapScatterPlot highlightId="curr-1" />
              </div>
            )}

            {/* TAB CONTENT: TIMELINE */}
            {activeTab === 'TIMELINE' && (
              <div className="mt-4 text-xs space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-900">10:04:12 UTC — Transaction Ingested</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Spring Boot Gateway routed to Transaction Service</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-900">10:04:13 UTC — ML Risk Evaluation Completed</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">FastAPI returned probability 0.74, uncertainty 0.42</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="font-bold text-amber-900">10:04:13 UTC — PENDING_REVIEW Triggered</p>
                  <p className="text-amber-700 text-[11px] mt-0.5">Uncertainty exceeded 0.35 threshold. Assigned to David Vance</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= ZONE 3: RIGHT / DECISION PANEL (3 cols) ================= */}
        <div className="lg:col-span-3 sticky top-20">
          <div className="bg-surface rounded-2xl border-2 border-navy-800/30 p-5 shadow-card">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-navy-800" />
                Adjudication Panel
              </h4>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                AUDITED
              </span>
            </div>

            {currentCase.status === 'RESOLVED' ? (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Final Decision:</span>
                  <StatusBadge status={currentCase.resolution?.decision || 'RESOLVED'} size="sm" />
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Reason Code:</span>
                  <p className="font-bold text-slate-900">{currentCase.resolution?.reasonCode}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Analyst:</span>
                  <p className="font-bold text-slate-900">{currentCase.resolution?.analystName}</p>
                </div>
                {currentCase.resolution?.notes && (
                  <div>
                    <span className="text-slate-400 font-medium">Notes:</span>
                    <p className="italic text-slate-600 mt-0.5">&ldquo;{currentCase.resolution.notes}&rdquo;</p>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleResolve} className="mt-4 space-y-4 text-xs">
                {/* Decision Toggle with Keyboard Shortcuts Hints */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-bold text-slate-700">Adjudication Action</label>
                    <span className="text-[10px] text-slate-400">Keys: [A] / [R]</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDecision('APPROVED')}
                      className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                        decision === 'APPROVED' 
                          ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      Approve <kbd className="text-[9px] bg-black/20 px-1 rounded">A</kbd>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDecision('REJECTED')}
                      className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                        decision === 'REJECTED' 
                          ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-300' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      Reject <kbd className="text-[9px] bg-black/20 px-1 rounded">R</kbd>
                    </button>
                  </div>
                </div>

                {/* Reason Code Dropdown (Required) */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Mandatory Reason Code</label>
                  <select
                    value={reasonCode}
                    onChange={e => setReasonCode(e.target.value as any)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800/20"
                  >
                    <option value="Customer confirmed">Customer confirmed</option>
                    <option value="Confirmed fraud">Confirmed fraud</option>
                    <option value="False positive">False positive</option>
                    <option value="Insufficient information">Insufficient information</option>
                  </select>
                </div>

                {/* Analyst Notes */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Investigation Evidence Notes</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Document supporting evidence, customer contact, or merchant verification..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-navy-800 to-navy-900 hover:from-navy-900 hover:to-black disabled:opacity-50 text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Recording Audit...' : 'Commit Adjudication Decision'}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
