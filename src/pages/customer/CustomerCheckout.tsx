import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { 
  CreditCard, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  Lock,
  Sparkles,
  Wifi,
  Eye,
  EyeOff
} from 'lucide-react';
import { Transaction } from '../../types/contracts';

export const CustomerCheckout: React.FC = () => {
  const { createTransaction } = useData();
  const navigate = useNavigate();

  const [merchant, setMerchant] = useState('Apple Store Regent St');
  const [amount, setAmount] = useState('1849.99');
  const [category, setCategory] = useState('Electronics');
  const [showCvv, setShowCvv] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ transaction: Transaction; reviewRequired: boolean } | null>(null);

  // Demo Presets to demonstrate the 3 core platform outcomes to professors
  const applyPreset = (type: 'normal' | 'borderline' | 'suspicious') => {
    if (type === 'normal') {
      setMerchant('Starbucks Reserve Boston');
      setAmount('18.50');
      setCategory('Food & Dining');
    } else if (type === 'borderline') {
      setMerchant('ElectroDepot Tech Superstore');
      setAmount('1849.99');
      setCategory('Electronics');
    } else {
      setMerchant('CryptoKiosk Global Exchange');
      setAmount('4890.00');
      setCategory('Crypto & Financial');
    }
    setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const numAmount = parseFloat(amount) || 50;
    let preset: 'normal' | 'borderline' | 'suspicious' = 'normal';
    if (numAmount > 3000) preset = 'suspicious';
    else if (numAmount > 800) preset = 'borderline';

    try {
      const res = await createTransaction({
        merchant,
        amount: numAmount,
        category,
        forcePreset: preset
      });
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  const parsedAmount = parseFloat(amount) || 0;
  const estimatedRisk = parsedAmount > 3000 ? 94 : parsedAmount > 800 ? 68 : 2;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Virtual Card Checkout & Real-time Scoring</h2>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-brand-blue uppercase font-mono">
            Interactive Testbed
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Execute simulated card checkouts to observe real-time FastAPI model evaluation, uncertainty boundary triggers, and automated routing.
        </p>
      </div>

      {/* Demo Scenario Presets Cards */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50/40 border border-slate-200/90 rounded-2xl p-4.5 shadow-subtle">
        <p className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Click a Scenario to Pre-populate Form & Observe Decision Logic:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => applyPreset('normal')}
            className="p-3.5 bg-surface hover:bg-emerald-50/60 rounded-xl border border-slate-200 hover:border-emerald-400 text-left transition-all text-xs group shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 group-hover:text-emerald-800">1. Nominal ($18.50)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Confidence 98% &rarr; Instant <strong>AUTO-APPROVE</strong></p>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('borderline')}
            className="p-3.5 bg-surface hover:bg-amber-50/60 rounded-xl border border-slate-200 hover:border-amber-400 text-left transition-all text-xs group shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 group-hover:text-amber-800">2. Borderline ($1,849.99)</span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Uncertainty 0.42 &rarr; <strong>HUMAN REVIEW QUEUE</strong></p>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('suspicious')}
            className="p-3.5 bg-surface hover:bg-rose-50/60 rounded-xl border border-slate-200 hover:border-rose-400 text-left transition-all text-xs group shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 group-hover:text-rose-800">3. Anomaly ($4,890.00)</span>
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Risk &gt;85% &rarr; Automated <strong>DECLINE & LOCK</strong></p>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form on Left (7 cols) */}
        <div className="lg:col-span-7 bg-surface rounded-2xl border border-slate-200 p-6 shadow-subtle">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Merchant Organization</label>
              <input
                type="text"
                value={merchant}
                onChange={e => setMerchant(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    required
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Merchant Category (MCC)</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                >
                  <option value="Electronics">Electronics (MCC 5732)</option>
                  <option value="Food & Dining">Food & Dining (MCC 5812)</option>
                  <option value="Crypto & Financial">Crypto & Financial (MCC 6051)</option>
                  <option value="Travel & Airline">Travel & Airline (MCC 4511)</option>
                  <option value="Luxury Goods">Luxury Goods (MCC 5944)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Authorized Card</label>
                <input
                  type="text"
                  disabled
                  value="Visa Platinum •••• 4192"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono text-slate-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Security Code (CVV)</label>
                <div className="relative">
                  <input
                    type={showCvv ? 'text' : 'password'}
                    disabled
                    value="842"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono text-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCvv(!showCvv)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCvv ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-navy-800 to-navy-900 hover:from-navy-900 hover:to-black disabled:opacity-50 text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  Routing to Gateway & FastAPI Model...
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  Authorize & Ingest Transaction (${parseFloat(amount || '0').toFixed(2)})
                </>
              )}
            </button>
          </form>
        </div>

        {/* Virtual Card & Live Result on Right (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Stunning 3D-styled Holographic Virtual Card */}
          <div className="relative rounded-2xl p-6 text-white shadow-elevated overflow-hidden bg-gradient-to-tr from-slate-950 via-navy-900 to-blue-950 border border-slate-700/50">
            {/* Hologram sheen effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -rotate-45 pointer-events-none" />

            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-blue-300 font-bold block">VIGILIA PLATINUM</span>
                <span className="text-[9px] text-slate-400">EMV 3DS 2.0 PROTECTED</span>
              </div>
              <Wifi className="w-5 h-5 text-slate-400 rotate-90" />
            </div>

            {/* Gold EMV Chip */}
            <div className="mt-5 w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-yellow-600 border border-amber-500/80 shadow-xs flex items-center justify-center">
              <div className="w-6 h-4 border border-amber-700/40 rounded-xs" />
            </div>

            <div className="mt-4 font-mono text-base tracking-widest text-slate-100 font-semibold drop-shadow-sm">
              4192 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 9812
            </div>

            <div className="mt-4 flex justify-between items-end text-xs">
              <div>
                <span className="text-[9px] text-slate-400 block font-mono">CARDHOLDER</span>
                <span className="font-bold text-slate-100 tracking-wider">ALEX JOHNSON</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-slate-400 block font-mono">EXPIRES</span>
                <span className="font-mono text-slate-100">08/29</span>
              </div>
            </div>
          </div>

          {/* Real-time Dynamic Risk Gauge Preview */}
          <div className="bg-surface rounded-2xl border border-slate-200 p-4 shadow-subtle text-xs">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-slate-500 font-semibold">Simulated Model Output</span>
              <span className={`font-mono font-bold ${estimatedRisk > 70 ? 'text-rose-600' : estimatedRisk > 40 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {estimatedRisk}% Predicted Risk
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${estimatedRisk > 70 ? 'bg-rose-500' : estimatedRisk > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${estimatedRisk}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>0% Auto-Approve</span>
              <span>35% Review Boundary</span>
              <span>85% Auto-Decline</span>
            </div>
          </div>

          {/* Submission Result Feedback */}
          {result && (
            <div className={`p-4.5 rounded-2xl border shadow-card animate-in fade-in zoom-in-95 duration-200 ${
              result.transaction.status === 'APPROVED'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : result.transaction.status === 'PENDING_REVIEW'
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              <div className="flex items-start gap-3">
                {result.transaction.status === 'APPROVED' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : result.transaction.status === 'PENDING_REVIEW' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Risk Decision: {result.transaction.status}
                  </h4>
                  <p className="text-xs mt-1 leading-snug">
                    {result.transaction.status === 'APPROVED' && 'Confidence 98% legitimate. Payment successfully cleared.'}
                    {result.transaction.status === 'PENDING_REVIEW' && 'High ML uncertainty (0.42 > 0.35 threshold). Dispatched to Human Review Queue.'}
                    {result.transaction.status === 'REJECTED' && 'Confident fraud detection. Card locked and transaction aborted.'}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-300/40 flex items-center justify-between text-[11px]">
                    <span className="font-mono">Speed: <strong>{result.transaction.prediction?.inference_time_ms} ms</strong></span>
                    <button
                      onClick={() => navigate(`/customer/transactions/${result.transaction.id}`)}
                      className="font-bold underline flex items-center gap-1"
                    >
                      View Live Tracker &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
