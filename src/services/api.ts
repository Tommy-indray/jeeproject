import { 
  Transaction, 
  InvestigationCase, 
  DecisionReasonCode, 
  AuditEvent, 
  ThresholdConfig, 
  MicroserviceHealth,
  ModelMetricSnapshot
} from '../types/contracts';
import { 
  MOCK_TRANSACTIONS, 
  MOCK_INVESTIGATION_CASES, 
  MOCK_AUDIT_LOGS, 
  MOCK_MICROSERVICES,
  MOCK_MODEL_SNAPSHOTS,
  INITIAL_THRESHOLDS
} from './mockData';

const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const ENABLE_MOCK = import.meta.env.VITE_ENABLE_MOCK_FALLBACK !== 'false';

// Generate standard UUID-like correlation ID
export function generateCorrelationId(): string {
  return 'c-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);
}

// In-memory store for interactive frontend demo state
let inMemoryTransactions = [...MOCK_TRANSACTIONS];
let inMemoryCases = [...MOCK_INVESTIGATION_CASES];
let inMemoryAudits = [...MOCK_AUDIT_LOGS];
let inMemoryServices = [...MOCK_MICROSERVICES];
let inMemoryThresholds = { ...INITIAL_THRESHOLDS };

export const api = {
  // ---- TRANSACTIONS ----
  async getTransactions(): Promise<Transaction[]> {
    try {
      if (!ENABLE_MOCK) {
        const res = await fetch(`${BASE_API_URL}/api/v1/transactions`, {
          headers: {
            'X-Correlation-ID': generateCorrelationId(),
            'Authorization': `Bearer ${localStorage.getItem('token') || 'demo-token'}`
          }
        });
        if (res.ok) return await res.json();
      }
    } catch (err) {
      console.warn('Backend unavailable, falling back to mock transactions', err);
    }
    return [...inMemoryTransactions];
  },

  async getTransactionById(id: string): Promise<Transaction | undefined> {
    const list = await this.getTransactions();
    return list.find(t => t.id === id);
  },

  async createTransaction(payload: {
    merchant: string;
    amount: number;
    category: string;
    cardLast4?: string;
    distanceKm?: number;
    forcePreset?: 'normal' | 'suspicious' | 'borderline';
  }): Promise<{ transaction: Transaction; reviewRequired: boolean }> {
    const correlationId = generateCorrelationId();

    // Determine ML Risk score based on amount/category or demo presets
    let fraudProb = 0.03;
    let uncertainty = 0.04;
    let status: 'APPROVED' | 'REJECTED' | 'PENDING_REVIEW' = 'APPROVED';

    if (payload.forcePreset === 'suspicious' || payload.amount > 3000) {
      fraudProb = 0.94;
      uncertainty = 0.08;
      status = 'REJECTED';
    } else if (payload.forcePreset === 'borderline' || (payload.amount > 800 && payload.amount <= 3000)) {
      fraudProb = 0.68;
      uncertainty = 0.44; // High uncertainty triggers human review!
      status = 'PENDING_REVIEW';
    } else {
      fraudProb = 0.02;
      uncertainty = 0.05;
      status = 'APPROVED';
    }

    const newTx: Transaction = {
      id: `tx-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: 'usr-cust-101',
      customerName: 'Alex Johnson',
      customerHomeLocation: { city: 'Boston', country: 'United States', lat: 42.3601, lon: -71.0589 },
      merchant: payload.merchant,
      merchantLocation: { city: 'Demo Location', country: 'United States', lat: 38.8951, lon: -77.0364 },
      distanceKm: payload.distanceKm || (payload.forcePreset === 'suspicious' ? 3200 : 15),
      amount: payload.amount,
      currency: 'USD',
      category: payload.category,
      timestamp: new Date().toISOString(),
      cardLast4: payload.cardLast4 || '4192',
      cardType: 'Visa Platinum',
      ipAddress: '198.51.100.77',
      status: status,
      correlationId: correlationId,
      prediction: {
        prediction: fraudProb > 0.5 ? 'FRAUD' : 'LEGITIMATE',
        probability: fraudProb,
        uncertainty: uncertainty,
        confidence: 1 - uncertainty,
        model_version: 'fraud-model-v3-xgboost',
        inference_time_ms: 11.8,
        explanation: {
          base_value: 0.08,
          top_features: [
            { feature: 'amount_vs_mean', label: `Amount ($${payload.amount.toFixed(2)})`, contribution: fraudProb > 0.5 ? 0.32 : -0.18, value: `$${payload.amount}`, description: 'Deviation from 90d baseline' },
            { feature: 'merchant_category', label: `Category: ${payload.category}`, contribution: fraudProb > 0.5 ? 0.22 : -0.10, value: payload.category, description: 'MCC risk index' },
            { feature: 'device_reputation', label: 'Device Integrity Fingerprint', contribution: -0.15, value: 'Trusted Cardholder Device', description: 'Browser TLS & Canvas hash match' }
          ]
        }
      }
    };

    inMemoryTransactions.unshift(newTx);

    // If PENDING_REVIEW, also create a case in the Analyst Queue!
    if (status === 'PENDING_REVIEW') {
      const newCase: InvestigationCase = {
        id: `CASE-2026-${Math.floor(100 + Math.random() * 899)}`,
        transactionId: newTx.id,
        transaction: newTx,
        priority: payload.amount > 1500 ? 'HIGH' : 'MEDIUM',
        status: 'PENDING',
        riskScore: Math.round(fraudProb * 100),
        calibratedProbability: fraudProb,
        uncertaintyScore: uncertainty,
        expectedLoss: Number((fraudProb * payload.amount).toFixed(2)),
        createdAt: new Date().toISOString(),
        slaDeadline: new Date(Date.now() + 60 * 60 * 1000).toISOString()
      };
      inMemoryCases.unshift(newCase);
    }

    // Append to Audit Trail
    inMemoryAudits.unshift({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'system:risk-management-service',
      actorRole: 'system',
      action: 'TRANSACTION_EVALUATED',
      entity: 'Transaction',
      entityId: newTx.id,
      result: status === 'REJECTED' ? 'WARNING' : 'SUCCESS',
      correlationId: correlationId,
      ipAddress: '10.244.2.14',
      details: {
        amount: newTx.amount,
        merchant: newTx.merchant,
        decision: status,
        mlProbability: fraudProb,
        uncertainty: uncertainty
      }
    });

    return { transaction: newTx, reviewRequired: status === 'PENDING_REVIEW' };
  },

  async submitCustomerFeedback(txId: string, feedback: 'CONFIRMED_LEGITIMATE' | 'REPORTED_FRAUD'): Promise<void> {
    const tx = inMemoryTransactions.find(t => t.id === txId);
    if (tx) {
      tx.customerFeedback = feedback;
      inMemoryAudits.unshift({
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'Alex Johnson (Customer)',
        actorRole: 'customer',
        action: 'CUSTOMER_FEEDBACK_RECORDED',
        entity: 'Transaction',
        entityId: tx.id,
        result: 'SUCCESS',
        correlationId: tx.correlationId,
        ipAddress: '24.18.99.12',
        details: { feedback, note: 'Cardholder responded to "Was this you?" security prompt' }
      });
    }
  },

  // ---- INVESTIGATION QUEUE & CASES ----
  async getInvestigationCases(): Promise<InvestigationCase[]> {
    try {
      if (!ENABLE_MOCK) {
        const res = await fetch(`${BASE_API_URL}/api/v1/cases`, {
          headers: {
            'X-Correlation-ID': generateCorrelationId(),
            'Authorization': `Bearer ${localStorage.getItem('token') || 'demo-token'}`
          }
        });
        if (res.ok) return await res.json();
      }
    } catch (err) {
      console.warn('Backend unavailable, using mock cases', err);
    }
    return [...inMemoryCases];
  },

  async getCaseById(caseId: string): Promise<InvestigationCase | undefined> {
    const cases = await this.getInvestigationCases();
    return cases.find(c => c.id === caseId || c.transactionId === caseId);
  },

  async resolveCase(caseId: string, payload: {
    decision: 'APPROVED' | 'REJECTED';
    reasonCode: DecisionReasonCode;
    notes?: string;
    analystName: string;
  }): Promise<InvestigationCase> {
    const c = inMemoryCases.find(item => item.id === caseId);
    if (!c) throw new Error('Case not found');

    const resolvedAt = new Date().toISOString();
    c.status = 'RESOLVED';
    c.resolution = {
      decision: payload.decision,
      reasonCode: payload.reasonCode,
      notes: payload.notes,
      analystName: payload.analystName,
      resolvedAt: resolvedAt
    };

    // Update corresponding transaction status
    const tx = inMemoryTransactions.find(t => t.id === c.transactionId);
    if (tx) {
      tx.status = payload.decision;
    }

    // Append to Audit Trail
    inMemoryAudits.unshift({
      id: `aud-${Date.now()}`,
      timestamp: resolvedAt,
      actor: payload.analystName,
      actorRole: 'analyst',
      action: payload.decision === 'APPROVED' ? 'DECISION_APPROVED' : 'DECISION_REJECTED',
      entity: 'InvestigationCase',
      entityId: c.id,
      result: 'SUCCESS',
      correlationId: c.transaction.correlationId,
      ipAddress: '192.168.1.102',
      diff: {
        field: 'status',
        before: 'PENDING_REVIEW',
        after: payload.decision
      },
      details: {
        reasonCode: payload.reasonCode,
        notes: payload.notes
      }
    });

    return { ...c };
  },

  // ---- AUDIT LOGS ----
  async getAuditLogs(): Promise<AuditEvent[]> {
    return [...inMemoryAudits];
  },

  // ---- SERVICE HEALTH ----
  async getMicroservicesHealth(): Promise<MicroserviceHealth[]> {
    return [...inMemoryServices];
  },

  async simulatePodKill(serviceName: string): Promise<void> {
    const svc = inMemoryServices.find(s => s.name === serviceName);
    if (svc) {
      svc.status = 'DEGRADED';
      svc.replicas.running = Math.max(0, svc.replicas.running - 1);
      
      inMemoryAudits.unshift({
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'Marc Lefebvre (Admin)',
        actorRole: 'admin',
        action: 'POD_TERMINATION_SIMULATED',
        entity: 'KubernetesPod',
        entityId: `${serviceName}-pod-test`,
        result: 'WARNING',
        correlationId: generateCorrelationId(),
        ipAddress: '10.244.0.1',
        details: { service: serviceName, message: 'Pod terminated deliberately to test Kubernetes auto-recovery.' }
      });

      // Kubernetes recovery after 6 seconds
      setTimeout(() => {
        svc.status = 'UP';
        svc.replicas.running = svc.replicas.desired;
      }, 6000);
    }
  },

  // ---- THRESHOLDS ----
  async getThresholds(): Promise<ThresholdConfig> {
    return { ...inMemoryThresholds };
  },

  async updateThresholds(config: ThresholdConfig): Promise<ThresholdConfig> {
    inMemoryThresholds = { ...config };
    inMemoryAudits.unshift({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'Marc Lefebvre (Admin)',
      actorRole: 'admin',
      action: 'RISK_THRESHOLDS_UPDATED',
      entity: 'ThresholdConfig',
      entityId: 'global-rules-v1',
      result: 'SUCCESS',
      correlationId: generateCorrelationId(),
      ipAddress: '10.244.0.1',
      details: { ...config }
    });
    return { ...inMemoryThresholds };
  },

  // ---- MODEL HEALTH ----
  async getModelSnapshots(): Promise<ModelMetricSnapshot[]> {
    return [...MOCK_MODEL_SNAPSHOTS];
  }
};

