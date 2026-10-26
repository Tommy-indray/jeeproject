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
  Sparkles
} from 'lucide-react';
import { Transaction } from '../../types/contracts';

export const CustomerCheckout: React.FC = () => {
  const { createTransaction } = useData();
  const navigate = useNavigate();

  const [merchant, setMerchant] = useState('Apple Store Regent St');
  const [amount, setAmount] = useState('1849.99');
  const [category, setCategory] = useState('Electronics');
  const [cardNumber, setCardNumber] = useState('4192 •••• •••• 9812');
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Virtual Checkout Simulation</h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-brand-blue uppercase">
            Interactive Demo
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Simulate online purchases to observe real-time FastAPI model evaluation, uncertainty boundaries, and automated routing.
        </p>
      </div>

      {/* Demo Scenario Presets */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-card p-4">
        <p className="text-xs font-semibold text-slate-700 mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Quick Test Scenarios (Evaluate Model Branching):
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => applyPreset('normal')}
            className="p-3 bg-surface hover:bg-emerald-50/50 rounded-xl border border-slate-200 hover:border-emerald-300 text-left transition-all text-xs"
          >
            <p className="font-bold text-slate-900">1. Normal Purchase ($18.50)</p>
            <p className="text-[11px] text-slate-500 mt-0.5">High confidence legitimate &rarr; Immediate AUTO-APPROVE</p>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('borderline')}
            className="p-3 bg-surface hover:bg-amber-50/50 rounded-xl border border-slate-200 hover:border-amber-300 text-left transition-all text-xs"
          >
            <p className="font-bold text-slate-900">2. Borderline Risk ($1,849.99)</p>
            <p className="text-[11px] text-slate-500 mt-0.5">High uncertainty &rarr; Routed to ANALYST REVIEW</p>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('suspicious')}
            className="p-3 bg-surface hover:bg-rose-50/50 rounded-xl border border-slate-200 hover:border-rose-300 text-left transition-all text-xs"
          >
            <p className="font-bold text-slate-900">3. High-Confidence Fraud ($4,890)</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Probability &gt;0.85 &rarr; Automated DECLINE</p>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form on Left */}
        <div className="lg:col-span-7 bg-surface rounded-card border border-slate-200 p-6 shadow-subtle">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Merchant Name</label>
              <input
                type="text"
                value={merchant}
                onChange={e => setMerchant(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    required
                    className="w-full pl-7 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Crypto & Financial">Crypto & Financial</option>
                  <option value="Travel & Airline">Travel & Airline</option>
                  <option value="Luxury Goods">Luxury Goods</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Card Token</label>
              <input
                type="text"
                disabled
                value={cardNumber}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono text-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-navy-800 hover:bg-navy-900 disabled:opacity-50 text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Evaluating ML Risk & Latency...
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  Authorize & Ingest Transaction
                </>
              )}
            </button>
          </form>
        </div>

        {/* Virtual Card & Result on Right */}
        <div className="lg:col-span-5 space-y-4">
          {/* Virtual Card Visual */}
          <div className="bg-gradient-to-tr from-slate-900 via-navy-800 to-blue-900 rounded-2xl p-5 text-white shadow-card relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-mono tracking-widest text-slate-300">VIGILIA PLATINUM</span>
              <CreditCard className="w-6 h-6 text-slate-300" />
            </div>

            <div className="mt-8 font-mono text-sm tracking-wider text-slate-200">
              4192 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 9812
            </div>

            <div className="mt-4 flex justify-between items-end text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">CARDHOLDER</span>
                <span className="font-medium text-slate-200">ALEX JOHNSON</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">EXPIRES</span>
                <span className="font-mono text-slate-200">08/29</span>
              </div>
            </div>
          </div>

          {/* Submission Result Feedback */}
          {result && (
            <div className={`p-4 rounded-card border shadow-card animate-in fade-in zoom-in-95 duration-200 ${
              result.transaction.status === 'APPROVED'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : result.transaction.status === 'PENDING_REVIEW'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <div className="flex items-start gap-2.5">
                {result.transaction.status === 'APPROVED' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                ) : result.transaction.status === 'PENDING_REVIEW' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                )}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide">
                    Decision: {result.transaction.status}
                  </h4>
                  <p className="text-xs mt-1 leading-snug">
                    {result.transaction.status === 'APPROVED' && 'Confidence 98% legitimate. Payment successfully cleared.'}
                    {result.transaction.status === 'PENDING_REVIEW' && 'High ML uncertainty (0.44 > 0.35 threshold). Dispatched to Human Review Queue.'}
                    {result.transaction.status === 'REJECTED' && 'Confident fraud detection. Card locked and transaction aborted.'}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-300/40 flex items-center justify-between text-[11px]">
                    <span>Inference Time: <strong className="font-mono">{result.transaction.prediction?.inference_time_ms} ms</strong></span>
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

