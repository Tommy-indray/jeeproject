import React, { useState } from 'react';
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
  HelpCircle
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
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <button
          onClick={() => navigate('/analyst/queue')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Investigation Queue
        </button>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400">Case ID: <strong className="text-slate-800 font-mono">{currentCase.id}</strong></span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-400">Correlation: <code className="font-mono text-[10px] text-slate-600">{tx.correlationId}</code></span>
          <StatusBadge status={currentCase.status === 'RESOLVED' ? (currentCase.resolution?.decision || 'RESOLVED') : currentCase.priority} size="sm" />
        </div>
      </div>

      {/* 3-ZONE SIGNATURE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= ZONE 1: LEFT / CONTEXT (3 cols) ================= */}
        <div className="lg:col-span-3 space-y-4">
          {/* Customer Profile Card */}
          <div className="bg-surface rounded-card border border-slate-200 p-4 shadow-subtle text-xs">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-navy-50 text-navy-800 flex items-center justify-center font-bold text-sm">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{tx.customerName}</p>
                <p className="text-[11px] text-slate-400 font-mono">ID: {tx.customerId}</p>
              </div>
            </div>

            <div className="mt-3 space-y-2 text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Home Residence</span>
                <span className="font-medium text-slate-800">{tx.customerHomeLocation.city}, {tx.customerHomeLocation.country}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Account Tier</span>
                <span className="font-semibold text-emerald-600">Tier 1 Platinum</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Tenure</span>
                <span className="font-medium text-slate-800">4.8 years</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Past Delinquency</span>
                <span className="font-medium text-slate-800 font-mono">0 incidents</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Average 90d Spend</span>
                <span className="font-medium text-slate-800 font-mono">$288.40 / tx</span>
              </div>
            </div>
          </div>

          {/* Quick Case Switcher */}
          <div className="bg-surface rounded-card border border-slate-200 p-4 shadow-subtle text-xs">
            <p className="font-bold text-slate-800 mb-2 uppercase tracking-wider text-[11px]">
              Other Queue Items
            </p>
            <div className="space-y-1.5">
              {cases.slice(0, 4).map(c => (
                <Link
                  key={c.id}
                  to={`/analyst/cases/${c.id}`}
                  className={`p-2 rounded-lg flex items-center justify-between transition-colors ${c.id === currentCase.id ? 'bg-navy-800 text-white font-semibold' : 'hover:bg-slate-50 text-slate-700'}`}
                >
                  <span className="font-mono">{c.id}</span>
                  <span>${c.transaction.amount.toFixed(0)}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Customer "Was This You?" Response Status */}
          <div className="bg-surface rounded-card border border-slate-200 p-4 shadow-subtle text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
              <HelpCircle className="w-4 h-4 text-brand-blue" />
              Customer Response Evidence
            </div>
            {tx.customerFeedback ? (
              <div className="mt-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                <p className="font-semibold">Customer Answered Prompt:</p>
                <p className="text-[11px] mt-0.5">
                  &ldquo;{tx.customerFeedback === 'CONFIRMED_LEGITIMATE' ? 'Yes, I made this purchase' : 'Fraud reported by customer'}&rdquo;
                </p>
              </div>
            ) : (
              <p className="mt-2 text-slate-400 italic">No direct customer response submitted yet.</p>
            )}
          </div>
        </div>

        {/* ================= ZONE 2: CENTER / EVIDENCE (6 cols) ================= */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Header Summary Banner */}
          <div className="bg-surface rounded-card border border-slate-200 p-5 shadow-subtle">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-mono font-medium text-slate-400">TRANSACTION EVALUATION</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{tx.merchant}</h3>
                <p className="text-xs text-slate-500">Category: {tx.category} &bull; Card: {tx.cardType} (**** {tx.cardLast4})</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Transaction Amount</span>
                <p className="text-2xl font-black text-slate-900">${tx.amount.toFixed(2)}</p>
              </div>
            </div>

            {/* Evidence Sub-Tabs */}
            <div className="flex items-center gap-1 mt-3 border-b border-slate-100 pb-2 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('WORKSPACE')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'WORKSPACE' ? 'bg-navy-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <FileText className="w-3.5 h-3.5" /> Workspace & Map
              </button>
              <button
                onClick={() => setActiveTab('SHAP')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'SHAP' ? 'bg-navy-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <Cpu className="w-3.5 h-3.5" /> SHAP Factors
              </button>
              <button
                onClick={() => setActiveTab('SIMILAR')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'SIMILAR' ? 'bg-navy-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <GitFork className="w-3.5 h-3.5" /> Similar Cases & UMAP
              </button>
              <button
                onClick={() => setActiveTab('TIMELINE')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'TIMELINE' ? 'bg-navy-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <History className="w-3.5 h-3.5" /> Audit History
              </button>
            </div>

            {/* TAB CONTENT: WORKSPACE */}
            {activeTab === 'WORKSPACE' && (
              <div className="mt-4 space-y-4">
                {/* ML Risk Score Ribbon */}
                {prediction && (
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Model Prediction</span>
                      <p className="font-bold text-slate-900 font-mono text-sm">
                        {prediction.prediction} ({(prediction.probability * 100).toFixed(1)}%)
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{prediction.model_version}</p>
                    </div>

                    <div className="text-center px-4 border-x border-slate-200">
                      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Uncertainty</span>
                      <p className="font-bold text-purple-700 font-mono text-sm">
                        ±{(prediction.uncertainty * 100).toFixed(1)}%
                      </p>
                      <span className="text-[10px] text-purple-500 font-medium">Conformal Review Band</span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Inference Speed</span>
                      <p className="font-bold text-slate-900 font-mono text-sm">{prediction.inference_time_ms} ms</p>
                      <span className="text-[10px] text-emerald-600 font-medium">FastAPI v0.1</span>
                    </div>
                  </div>
                )}

                {/* Map Component */}
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
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="font-semibold text-slate-800">10:04:12 UTC — Transaction Ingested</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Spring Boot Gateway routed to Transaction Service</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="font-semibold text-slate-800">10:04:13 UTC — ML Risk Evaluation Completed</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">FastAPI returned probability 0.74, uncertainty 0.42</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="font-semibold text-amber-900">10:04:13 UTC — PENDING_REVIEW Triggered</p>
                  <p className="text-amber-700 text-[11px] mt-0.5">Uncertainty exceeded 0.35 threshold. Assigned to Sarah Chen</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= ZONE 3: RIGHT / DECISION PANEL (3 cols) ================= */}
        <div className="lg:col-span-3 sticky top-20">
          <div className="bg-surface rounded-card border-2 border-navy-800/20 p-5 shadow-card">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-navy-800" />
                Adjudication Panel
              </h4>
              <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                AUDITED
              </span>
            </div>

            {currentCase.status === 'RESOLVED' ? (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Final Decision:</span>
                  <StatusBadge status={currentCase.resolution?.decision || 'RESOLVED'} size="sm" />
                </div>
                <div>
                  <span className="text-slate-400">Reason Code:</span>
                  <p className="font-semibold text-slate-800">{currentCase.resolution?.reasonCode}</p>
                </div>
                <div>
                  <span className="text-slate-400">Analyst:</span>
                  <p className="font-semibold text-slate-800">{currentCase.resolution?.analystName}</p>
                </div>
                {currentCase.resolution?.notes && (
                  <div>
                    <span className="text-slate-400">Notes:</span>
                    <p className="italic text-slate-600 mt-0.5">&ldquo;{currentCase.resolution.notes}&rdquo;</p>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleResolve} className="mt-4 space-y-4 text-xs">
                {/* Decision Toggle */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-2">Final Action</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDecision('APPROVED')}
                      className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${decision === 'APPROVED' ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => setDecision('REJECTED')}
                      className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${decision === 'REJECTED' ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>

                {/* Reason Code Dropdown (Required) */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Required Reason Code</label>
                  <select
                    value={reasonCode}
                    onChange={e => setReasonCode(e.target.value as any)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800/20"
                  >
                    <option value="Customer confirmed">Customer confirmed</option>
                    <option value="Confirmed fraud">Confirmed fraud</option>
                    <option value="False positive">False positive</option>
                    <option value="Insufficient information">Insufficient information</option>
                  </select>
                </div>

                {/* Analyst Notes */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Investigation Evidence Notes</label>
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
                  className="w-full bg-navy-800 hover:bg-navy-900 disabled:opacity-50 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
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

