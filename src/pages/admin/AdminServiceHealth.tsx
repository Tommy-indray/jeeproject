import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { MicroserviceHealth } from '../../types/contracts';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  Server, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  Flame, 
  ArrowRight,
  Layers
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export const AdminServiceHealth: React.FC = () => {
  const [services, setServices] = useState<MicroserviceHealth[]>([]);
  const [loading, setLoading] = useState(true);
  const [killingService, setKillingService] = useState<string | null>(null);
  const { showToast } = useNotification();

  const loadServices = async () => {
    try {
      const data = await api.getMicroservicesHealth();
      setServices(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
    const interval = setInterval(loadServices, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateKill = async (serviceName: string) => {
    setKillingService(serviceName);
    showToast('warning', 'Chaos Experiment: Pod Terminated', `Simulated killing replica on ${serviceName}. Kubernetes auto-recovery active.`);
    await api.simulatePodKill(serviceName);
    await loadServices();
    setTimeout(() => {
      setKillingService(null);
      showToast('success', 'Replica Restored', `Kubernetes self-healing restored desired replicas for ${serviceName}.`);
      loadServices();
    }, 6000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Microservice Topology & Pod Health</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-navy-100 text-navy-800">
              8 SERVICES REGISTERED
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            End-to-end dependency chain, Kubernetes probes, circuit breakers, and self-healing resilience tests.
          </p>
        </div>

        <button
          onClick={loadServices}
          className="p-2 rounded-lg bg-surface border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Telemetry
        </button>
      </div>

      {/* Visual Service Dependency Flow Diagram */}
      <div className="bg-surface rounded-card border border-slate-200 p-5 shadow-subtle">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Architecture Dependency Pipeline
        </h4>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 py-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-semibold text-slate-800">
          <div className="px-3 py-2 rounded-lg bg-white border border-slate-200 shadow-sm text-center">
            <p className="text-[10px] text-slate-400">Public Entry</p>
            <p className="text-navy-800 font-bold">API Gateway (:8080)</p>
          </div>
          <span className="text-slate-400">&rarr;</span>
          <div className="px-3 py-2 rounded-lg bg-white border border-slate-200 shadow-sm text-center">
            <p className="text-[10px] text-slate-400">Ingestion</p>
            <p className="text-navy-800 font-bold">Transaction (:8083)</p>
          </div>
          <span className="text-slate-400">&rarr;</span>
          <div className="px-3 py-2 rounded-lg bg-white border border-slate-200 shadow-sm text-center">
            <p className="text-[10px] text-slate-400">Evaluation</p>
            <p className="text-navy-800 font-bold">Risk Mgmt (:8084)</p>
          </div>
          <span className="text-slate-400">&rarr;</span>
          <div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 shadow-sm text-center">
            <p className="text-[10px] text-blue-500">FastAPI ML</p>
            <p className="text-brand-blue font-bold">ML Serving (:8000)</p>
          </div>
          <span className="text-slate-400">&rarr;</span>
          <div className="px-3 py-2 rounded-lg bg-white border border-slate-200 shadow-sm text-center">
            <p className="text-[10px] text-slate-400">Compliance</p>
            <p className="text-navy-800 font-bold">Audit (:8086)</p>
          </div>
        </div>
      </div>

      {/* Grid of 8 Microservice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map(svc => {
          const isKilling = killingService === svc.name;

          return (
            <div 
              key={svc.name}
              className={`bg-surface rounded-card border p-4 shadow-subtle transition-all flex flex-col justify-between ${
                svc.status === 'DEGRADED' ? 'border-amber-300 ring-2 ring-amber-100' :
                svc.status === 'DOWN' ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-navy-50 text-navy-800">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs truncate max-w-[130px]">{svc.displayName}</h4>
                      <p className="text-[10px] font-mono text-slate-400">Port {svc.port} &bull; Owner M{svc.owner}</p>
                    </div>
                  </div>
                  <StatusBadge status={svc.status} size="sm" />
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Replicas</span>
                    <span className="font-bold font-mono text-slate-800">
                      {svc.replicas.running} / {svc.replicas.desired} pods
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Throughput</span>
                    <span className="font-mono text-slate-800">{svc.requestRateRps} rps</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">p95 Latency</span>
                    <span className="font-mono text-slate-800">{svc.latencyP95Ms} ms</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Circuit Breaker</span>
                    <span className="font-semibold text-emerald-600 font-mono text-[11px]">{svc.circuitBreaker}</span>
                  </div>
                </div>
              </div>

              {/* Chaos Testing Pod Kill Button */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isKilling}
                  onClick={() => handleSimulateKill(svc.name)}
                  className="w-full py-1.5 px-2 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-[11px] font-semibold text-slate-600 hover:text-rose-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  {isKilling ? 'Simulating failure...' : 'Test Pod Termination (Chaos)'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

