/**
 * Vigilia Platform — Shared Interface Contracts
 * Aligned with backend Spring Boot microservices, FastAPI ML serving,
 * and UI/UX Blueprint specifications.
 */

export type UserRole = 'customer' | 'analyst' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export type TransactionStatus = 'APPROVED' | 'REJECTED' | 'PENDING_REVIEW';
export type CustomerFeedback = 'CONFIRMED_LEGITIMATE' | 'REPORTED_FRAUD' | null;

export interface GeoLocation {
  city: string;
  country: string;
  lat: number;
  lon: number;
}

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  customerHomeLocation: GeoLocation;
  merchant: string;
  merchantLocation: GeoLocation;
  distanceKm: number;
  amount: number;
  currency: string;
  category: string;
  timestamp: string;
  cardLast4: string;
  cardType: string;
  ipAddress: string;
  status: TransactionStatus;
  customerFeedback?: CustomerFeedback;
  prediction?: MlPredictionResponse;
  correlationId: string;
}

export interface ShapFeatureContribution {
  feature: string;
  label: string;
  contribution: number; // Positive increases risk, negative decreases
  value: string | number;
  description: string;
}

export interface MlPredictionResponse {
  prediction: 'FRAUD' | 'LEGITIMATE';
  probability: number;      // e.g. 0.94 (94% predicted probability of fraud)
  uncertainty: number;      // e.g. 0.06 (Uncertainty score, > 0.35 requires review)
  confidence: number;       // 1 - uncertainty
  model_version: string;    // e.g. 'fraud-model-v3-xgboost'
  inference_time_ms: number;
  explanation: {
    base_value: number;
    top_features: ShapFeatureContribution[];
  };
}

export type CasePriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type CaseStatus = 'PENDING' | 'IN_REVIEW' | 'RESOLVED';
export type DecisionReasonCode = 
  | 'Confirmed fraud'
  | 'Customer confirmed'
  | 'False positive'
  | 'Insufficient information';

export interface InvestigationCase {
  id: string;
  transactionId: string;
  transaction: Transaction;
  priority: CasePriority;
  status: CaseStatus;
  riskScore: number;                 // 0 to 100
  calibratedProbability: number;     // 0.0 to 1.0
  uncertaintyScore: number;          // 0.0 to 1.0
  expectedLoss: number;              // probability * amount in $
  assignedAnalyst?: string;
  createdAt: string;
  slaDeadline: string;
  resolution?: {
    decision: 'APPROVED' | 'REJECTED';
    reasonCode: DecisionReasonCode;
    notes?: string;
    analystName: string;
    resolvedAt: string;
  };
}

export interface SimilarCase {
  id: string;
  caseId: string;
  merchant: string;
  amount: number;
  category: string;
  similarityScore: number; // 0 to 100%
  matchingAttributes: string[];
  resolution: 'APPROVED' | 'REJECTED';
  date: string;
  distanceKm: number;
}

export interface UmapEmbeddingPoint {
  id: string;
  x: number;
  y: number;
  label: 'FRAUD' | 'LEGITIMATE';
  predicted: 'FRAUD' | 'LEGITIMATE';
  uncertainty: number;
  amount: number;
  merchant: string;
  isCurrent?: boolean;
  isOutlier?: boolean;
}

export interface CalibrationPoint {
  bin: number;
  binRange: string;
  meanPredicted: number;
  fractionOfPositives: number;
  sampleCount: number;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  entity: string;
  entityId: string;
  result: 'SUCCESS' | 'FAILURE' | 'WARNING';
  correlationId: string;
  ipAddress: string;
  diff?: {
    field: string;
    before: string;
    after: string;
  };
  details?: Record<string, any>;
}

export interface TraceSpan {
  service: string;
  operation: string;
  durationMs: number;
  offsetMs: number;
  status: 'OK' | 'ERROR';
  httpStatus: number;
  error?: string;
}

export interface DistributedTrace {
  traceId: string;
  correlationId: string;
  endpoint: string;
  timestamp: string;
  totalDurationMs: number;
  status: 'OK' | 'ERROR';
  spans: TraceSpan[];
}

export interface MicroserviceHealth {
  name: string;
  displayName: string;
  port: number;
  owner: number;
  status: 'UP' | 'DOWN' | 'DEGRADED';
  liveness: string;
  readiness: string;
  uptimeSeconds: number;
  replicas: {
    running: number;
    desired: number;
  };
  latencyP95Ms: number;
  requestRateRps: number;
  errorRatePercent: number;
  circuitBreaker: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}

export interface ModelMetricSnapshot {
  name: string;
  version: string;
  algorithm: string;
  trainedAt: string;
  deployedAt: string;
  status: 'CHAMPION' | 'CANDIDATE' | 'ARCHIVED';
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  rocAuc: number;
  prAuc: number;
  mcc: number;
  brierScore: number;
  inferenceTimeMs: number;
  driftPValue: number; // e.g. Kolmogorov-Smirnov test p-value (>0.05 means no significant drift)
  driftStatus: 'STABLE' | 'WARNING' | 'DRIFT_DETECTED';
}

export interface ThresholdConfig {
  approvalThreshold: number; // below this auto-approve (e.g. 0.20)
  rejectionThreshold: number; // above this auto-reject (e.g. 0.85)
  uncertaintyThreshold: number; // uncertainty above this goes to review (e.g. 0.35)
}

export interface SystemAlert {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  service: string;
  timestamp: string;
  resolved: boolean;
  actionUrl?: string;
}

