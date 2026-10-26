import { 
  Transaction, 
  InvestigationCase, 
  SimilarCase, 
  UmapEmbeddingPoint, 
  CalibrationPoint, 
  AuditEvent, 
  DistributedTrace, 
  MicroserviceHealth, 
  ModelMetricSnapshot, 
  ThresholdConfig, 
  SystemAlert,
  User
} from '../types/contracts';

export const MOCK_USERS: Record<string, User> = {
  customer: {
    id: 'usr-cust-101',
    name: 'Alex Johnson',
    email: 'alex.johnson@vigilia-bank.com',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  analyst: {
    id: 'usr-an-204',
    name: 'Sarah Chen',
    email: 'sarah.chen@fraud-ops.vigilia.com',
    role: 'analyst',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  admin: {
    id: 'usr-adm-001',
    name: 'Aya Benzian',
    email: 'admin@vigilia-platform.internal',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  }
};

export const INITIAL_THRESHOLDS: ThresholdConfig = {
  approvalThreshold: 0.20,
  rejectionThreshold: 0.85,
  uncertaintyThreshold: 0.35
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-9942',
    customerId: 'usr-cust-101',
    customerName: 'Alex Johnson',
    customerHomeLocation: { city: 'Boston', country: 'United States', lat: 42.3601, lon: -71.0589 },
    merchant: 'ElectroDepot Tech Superstore',
    merchantLocation: { city: 'Miami', country: 'United States', lat: 25.7617, lon: -80.1918 },
    distanceKm: 2025,
    amount: 1849.99,
    currency: 'USD',
    category: 'Electronics',
    timestamp: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
    cardLast4: '4192',
    cardType: 'Visa Platinum',
    ipAddress: '198.51.100.42',
    status: 'PENDING_REVIEW',
    correlationId: 'c-8f12a9-e31b-4b',
    prediction: {
      prediction: 'FRAUD',
      probability: 0.74,
      uncertainty: 0.42,
      confidence: 0.58,
      model_version: 'fraud-model-v3-xgboost',
      inference_time_ms: 12.4,
      explanation: {
        base_value: 0.08,
        top_features: [
          { feature: 'distance_from_home', label: 'Distance from Registered Home (2,025 km)', contribution: 0.34, value: '2025 km', description: 'Transaction executed far outside normal cardholder radius' },
          { feature: 'amount_vs_mean', label: 'Transaction Amount vs 90d Average ($1,849.99)', contribution: 0.26, value: '6.4x avg', description: 'Amount is 6.4 standard deviations above regular average' },
          { feature: 'device_velocity', label: '1-Hour Attempt Velocity', contribution: 0.18, value: '3 attempts / hr', description: 'Sudden burst of consecutive checkouts across merchants' },
          { feature: 'terminal_risk_score', label: 'Merchant High-Risk MCC Flag', contribution: 0.12, value: 'Category 5732', description: 'Consumer electronics store flagged for high stolen credential usage' },
          { feature: 'regular_hour_window', label: 'Cardholder Active Hours', contribution: -0.16, value: '14:22 EST', description: 'Time matches normal cardholder daylight activity' },
          { feature: 'chip_pin_verification', label: '3DS 2.0 Strong Auth Status', contribution: -0.08, value: 'Soft-OTP Pass', description: 'One-time SMS token verification passed' }
        ]
      }
    }
  },
  {
    id: 'tx-9941',
    customerId: 'usr-cust-101',
    customerName: 'Alex Johnson',
    customerHomeLocation: { city: 'Boston', country: 'United States', lat: 42.3601, lon: -71.0589 },
    merchant: 'Whole Foods Market',
    merchantLocation: { city: 'Boston', country: 'United States', lat: 42.3551, lon: -71.0656 },
    distanceKm: 1.2,
    amount: 84.50,
    currency: 'USD',
    category: 'Groceries',
    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    cardLast4: '4192',
    cardType: 'Visa Platinum',
    ipAddress: '24.18.99.12',
    status: 'APPROVED',
    customerFeedback: null,
    correlationId: 'c-3b91a2-99ca-11',
    prediction: {
      prediction: 'LEGITIMATE',
      probability: 0.02,
      uncertainty: 0.04,
      confidence: 0.96,
      model_version: 'fraud-model-v3-xgboost',
      inference_time_ms: 8.1,
      explanation: {
        base_value: 0.08,
        top_features: [
          { feature: 'distance_from_home', label: 'Proximity to Home (1.2 km)', contribution: -0.22, value: '1.2 km', description: 'Habitual home neighborhood' },
          { feature: 'amount_vs_mean', label: 'Normal Spending Range ($84.50)', contribution: -0.15, value: '1.0x avg', description: 'Matches historical grocery bills' }
        ]
      }
    }
  },
  {
    id: 'tx-9940',
    customerId: 'usr-cust-101',
    customerName: 'Alex Johnson',
    customerHomeLocation: { city: 'Boston', country: 'United States', lat: 42.3601, lon: -71.0589 },
    merchant: 'Blue Bottle Coffee',
    merchantLocation: { city: 'Boston', country: 'United States', lat: 42.3522, lon: -71.0553 },
    distanceKm: 0.8,
    amount: 6.75,
    currency: 'USD',
    category: 'Food & Dining',
    timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    cardLast4: '4192',
    cardType: 'Visa Platinum',
    ipAddress: '24.18.99.12',
    status: 'APPROVED',
    customerFeedback: null,
    correlationId: 'c-1d44fe-5201-90',
    prediction: {
      prediction: 'LEGITIMATE',
      probability: 0.01,
      uncertainty: 0.02,
      confidence: 0.98,
      model_version: 'fraud-model-v3-xgboost',
      inference_time_ms: 7.4,
      explanation: {
        base_value: 0.08,
        top_features: [
          { feature: 'frequent_merchant', label: 'Recurring Merchant Profile', contribution: -0.28, value: '14 visits', description: 'Trusted regular merchant' }
        ]
      }
    }
  },
  {
    id: 'tx-9939',
    customerId: 'usr-cust-101',
    customerName: 'Alex Johnson',
    customerHomeLocation: { city: 'Boston', country: 'United States', lat: 42.3601, lon: -71.0589 },
    merchant: 'CryptoKiosk Global Exchange',
    merchantLocation: { city: 'Nicosia', country: 'Cyprus', lat: 35.1856, lon: 33.3823 },
    distanceKm: 8120,
    amount: 4890.00,
    currency: 'USD',
    category: 'Crypto & Financial',
    timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    cardLast4: '4192',
    cardType: 'Visa Platinum',
    ipAddress: '185.220.101.5',
    status: 'REJECTED',
    customerFeedback: 'REPORTED_FRAUD',
    correlationId: 'c-ee9001-ff82-41',
    prediction: {
      prediction: 'FRAUD',
      probability: 0.97,
      uncertainty: 0.05,
      confidence: 0.95,
      model_version: 'fraud-model-v3-xgboost',
      inference_time_ms: 11.2,
      explanation: {
        base_value: 0.08,
        top_features: [
          { feature: 'tor_vpn_detected', label: 'High-Anonymity Exit Node IP', contribution: 0.42, value: 'Tor Gateway', description: 'Known cybercrime proxy origin' },
          { feature: 'foreign_crypto_amount', label: 'Large First-Time Virtual Asset', contribution: 0.38, value: '$4,890.00', description: 'Sudden transfer to off-shore crypto merchant' }
        ]
      }
    }
  },
  {
    id: 'tx-9938',
    customerId: 'usr-cust-101',
    customerName: 'Alex Johnson',
    customerHomeLocation: { city: 'Boston', country: 'United States', lat: 42.3601, lon: -71.0589 },
    merchant: 'Uber Technologies Inc',
    merchantLocation: { city: 'Boston', country: 'United States', lat: 42.3601, lon: -71.0589 },
    distanceKm: 2.5,
    amount: 28.40,
    currency: 'USD',
    category: 'Transportation',
    timestamp: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    cardLast4: '4192',
    cardType: 'Visa Platinum',
    ipAddress: '24.18.99.12',
    status: 'APPROVED',
    customerFeedback: null,
    correlationId: 'c-8822ee-1100-33',
    prediction: {
      prediction: 'LEGITIMATE',
      probability: 0.03,
      uncertainty: 0.05,
      confidence: 0.95,
      model_version: 'fraud-model-v3-xgboost',
      inference_time_ms: 8.8,
      explanation: {
        base_value: 0.08,
        top_features: [
          { feature: 'recurring_subscription', label: 'Tokenized In-App Payment', contribution: -0.25, value: 'Stored Card', description: 'Trusted app token' }
        ]
      }
    }
  }
];

export const MOCK_INVESTIGATION_CASES: InvestigationCase[] = [
  {
    id: 'CASE-2026-081',
    transactionId: 'tx-9942',
    transaction: MOCK_TRANSACTIONS[0],
    priority: 'HIGH',
    status: 'PENDING',
    riskScore: 74,
    calibratedProbability: 0.74,
    uncertaintyScore: 0.42,
    expectedLoss: 1368.99, // 0.74 * 1849.99
    createdAt: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() + 36 * 60 * 1000).toISOString(),
  },
  {
    id: 'CASE-2026-080',
    transactionId: 'tx-9812',
    transaction: {
      id: 'tx-9812',
      customerId: 'usr-cust-512',
      customerName: 'Marcus Vance',
      customerHomeLocation: { city: 'Chicago', country: 'United States', lat: 41.8781, lon: -87.6298 },
      merchant: 'LuxeJewels Flagship Salon',
      merchantLocation: { city: 'Las Vegas', country: 'United States', lat: 36.1699, lon: -115.1398 },
      distanceKm: 2450,
      amount: 4200.00,
      currency: 'USD',
      category: 'Luxury Goods',
      timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
      cardLast4: '8810',
      cardType: 'Mastercard World Elite',
      ipAddress: '172.56.21.90',
      status: 'PENDING_REVIEW',
      correlationId: 'c-3300bb-44aa-12',
      prediction: {
        prediction: 'FRAUD',
        probability: 0.82,
        uncertainty: 0.38,
        confidence: 0.62,
        model_version: 'fraud-model-v3-xgboost',
        inference_time_ms: 14.1,
        explanation: {
          base_value: 0.08,
          top_features: [
            { feature: 'amount_vs_mean', label: 'Amount vs Profile Average ($4,200)', contribution: 0.39, value: '9.2x avg', description: 'Exceptional luxury jewelry purchase' },
            { feature: 'distance_from_home', label: 'Distance from Registered City (2,450 km)', contribution: 0.28, value: '2450 km', description: 'No prior travel recorded in region' },
            { feature: 'card_not_present', label: 'MOTO / CNP Web Gateway', contribution: 0.15, value: 'CNP Web', description: 'Card not physically swiped' }
          ]
        }
      }
    },
    priority: 'HIGH',
    status: 'IN_REVIEW',
    assignedAnalyst: 'Sarah Chen',
    riskScore: 82,
    calibratedProbability: 0.82,
    uncertaintyScore: 0.38,
    expectedLoss: 3444.00,
    createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 mins left
  },
  {
    id: 'CASE-2026-079',
    transactionId: 'tx-9744',
    transaction: {
      id: 'tx-9744',
      customerId: 'usr-cust-304',
      customerName: 'Elena Rostova',
      customerHomeLocation: { city: 'New York', country: 'United States', lat: 40.7128, lon: -74.0060 },
      merchant: 'AeroFly International Lines',
      merchantLocation: { city: 'Frankfurt', country: 'Germany', lat: 50.1109, lon: 8.6821 },
      distanceKm: 6200,
      amount: 920.00,
      currency: 'USD',
      category: 'Travel & Airline',
      timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      cardLast4: '5519',
      cardType: 'Visa Infinite',
      ipAddress: '194.25.10.12',
      status: 'PENDING_REVIEW',
      correlationId: 'c-41ab99-dd23-88',
      prediction: {
        prediction: 'FRAUD',
        probability: 0.58,
        uncertainty: 0.49, // High uncertainty borderline
        confidence: 0.51,
        model_version: 'fraud-model-v3-xgboost',
        inference_time_ms: 10.8,
        explanation: {
          base_value: 0.08,
          top_features: [
            { feature: 'international_airline', label: 'International Departure Airport', contribution: 0.29, value: 'FRA Hub', description: 'German flight purchase on US card' },
            { feature: 'frequent_flyer_history', label: 'Past Airline Booking History', contribution: -0.21, value: 'Matches Profile', description: 'Customer frequently travels for business' }
          ]
        }
      }
    },
    priority: 'MEDIUM',
    status: 'PENDING',
    riskScore: 58,
    calibratedProbability: 0.58,
    uncertaintyScore: 0.49,
    expectedLoss: 533.60,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() + 110 * 60 * 1000).toISOString(),
  },
  {
    id: 'CASE-2026-078',
    transactionId: 'tx-9690',
    transaction: {
      id: 'tx-9690',
      customerId: 'usr-cust-882',
      customerName: 'David Kim',
      customerHomeLocation: { city: 'Seattle', country: 'United States', lat: 47.6062, lon: -122.3321 },
      merchant: 'GameStream Digital Store',
      merchantLocation: { city: 'Seattle', country: 'United States', lat: 47.6062, lon: -122.3321 },
      distanceKm: 5.0,
      amount: 149.99,
      currency: 'USD',
      category: 'Digital Entertainment',
      timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      cardLast4: '1092',
      cardType: 'Mastercard Debit',
      ipAddress: '73.11.200.4',
      status: 'RESOLVED',
      correlationId: 'c-0091aa-33bb-77',
      prediction: {
        prediction: 'FRAUD',
        probability: 0.62,
        uncertainty: 0.41,
        confidence: 0.59,
        model_version: 'fraud-model-v3-xgboost',
        inference_time_ms: 9.3,
        explanation: {
          base_value: 0.08,
          top_features: [
            { feature: 'device_fingerprint_mismatch', label: 'New Device Fingerprint', contribution: 0.31, value: 'Linux WebKit', description: 'First login from new operating system' },
            { feature: 'customer_history', label: 'Longstanding Loyal Account', contribution: -0.20, value: '5 yrs active', description: 'Zero previous delinquency' }
          ]
        }
      }
    },
    priority: 'LOW',
    status: 'RESOLVED',
    assignedAnalyst: 'Sarah Chen',
    riskScore: 62,
    calibratedProbability: 0.62,
    uncertaintyScore: 0.41,
    expectedLoss: 92.99,
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    resolution: {
      decision: 'APPROVED',
      reasonCode: 'Customer confirmed',
      notes: 'Customer confirmed online video game subscription purchase via SMS alert callback.',
      analystName: 'Sarah Chen',
      resolvedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
    }
  }
];

export const MOCK_SIMILAR_CASES: SimilarCase[] = [
  {
    id: 'SIM-101',
    caseId: 'CASE-2025-992',
    merchant: 'BestBuy Electronics Superstore',
    amount: 1799.00,
    category: 'Electronics',
    similarityScore: 94,
    matchingAttributes: ['High-value Consumer Electronics', 'Cross-State Distance >1500km', 'Card Not Present Web Checkout', 'Night-time Execution'],
    resolution: 'REJECTED',
    date: '2026-09-18',
    distanceKm: 1980
  },
  {
    id: 'SIM-102',
    caseId: 'CASE-2025-840',
    merchant: 'Apple Store Online',
    amount: 1999.00,
    category: 'Electronics',
    similarityScore: 89,
    matchingAttributes: ['High-value Consumer Electronics', 'Rapid Velocity (3 checkouts in 1hr)', 'Same device fingerprint mismatch'],
    resolution: 'REJECTED',
    date: '2026-08-30',
    distanceKm: 2150
  },
  {
    id: 'SIM-103',
    caseId: 'CASE-2025-715',
    merchant: 'B&H Photo Video New York',
    amount: 1450.00,
    category: 'Electronics',
    similarityScore: 78,
    matchingAttributes: ['High Amount', 'Legitimate cardholder vacation purchase confirmed'],
    resolution: 'APPROVED',
    date: '2026-07-12',
    distanceKm: 350
  }
];

// 120 points for 2D UMAP scatter plot projection
export const MOCK_UMAP_POINTS: UmapEmbeddingPoint[] = [
  // Current Case
  { id: 'curr-1', x: 4.82, y: 3.91, label: 'FRAUD', predicted: 'FRAUD', uncertainty: 0.42, amount: 1849.99, merchant: 'ElectroDepot (Current Case)', isCurrent: true },
  
  // Fraud Cluster (Top Right, x: 3.5 to 7.0, y: 2.5 to 6.0)
  { id: 'f-1', x: 5.1, y: 4.2, label: 'FRAUD', predicted: 'FRAUD', uncertainty: 0.08, amount: 2400, merchant: 'ElectroWorld' },
  { id: 'f-2', x: 5.6, y: 4.8, label: 'FRAUD', predicted: 'FRAUD', uncertainty: 0.05, amount: 3100, merchant: 'CryptoOutlet' },
  { id: 'f-3', x: 4.9, y: 3.5, label: 'FRAUD', predicted: 'FRAUD', uncertainty: 0.12, amount: 1950, merchant: 'LuxeGifts' },
  { id: 'f-4', x: 6.2, y: 5.1, label: 'FRAUD', predicted: 'FRAUD', uncertainty: 0.04, amount: 4800, merchant: 'TorShop' },
  { id: 'f-5', x: 5.8, y: 3.8, label: 'FRAUD', predicted: 'FRAUD', uncertainty: 0.09, amount: 2100, merchant: 'JewelEmpire' },
  { id: 'f-6', x: 4.3, y: 4.6, label: 'FRAUD', predicted: 'FRAUD', uncertainty: 0.19, amount: 1600, merchant: 'GadgetZone' },
  { id: 'f-7', x: 6.5, y: 4.4, label: 'FRAUD', predicted: 'FRAUD', uncertainty: 0.03, amount: 5500, merchant: 'GlobalEx' },
  { id: 'f-8', x: 5.3, y: 5.4, label: 'FRAUD', predicted: 'FRAUD', uncertainty: 0.07, amount: 3800, merchant: 'TechHaven' },
  { id: 'f-9', x: 4.6, y: 3.2, label: 'FRAUD', predicted: 'FRAUD', uncertainty: 0.22, amount: 1400, merchant: 'FlyExpress' },
  { id: 'f-10', x: 6.0, y: 3.1, label: 'FRAUD', predicted: 'FRAUD', uncertainty: 0.11, amount: 2900, merchant: 'PayGateway' },
  
  // High Uncertainty / Boundary Zone (Center, x: 1.5 to 3.5, y: 0.5 to 2.5)
  { id: 'u-1', x: 2.8, y: 1.9, label: 'LEGITIMATE', predicted: 'FRAUD', uncertainty: 0.48, amount: 890, merchant: 'AirBooking' },
  { id: 'u-2', x: 3.1, y: 2.2, label: 'FRAUD', predicted: 'FRAUD', uncertainty: 0.45, amount: 1100, merchant: 'CameraCity' },
  { id: 'u-3', x: 2.3, y: 1.4, label: 'LEGITIMATE', predicted: 'LEGITIMATE', uncertainty: 0.41, amount: 750, merchant: 'HotelStay' },
  { id: 'u-4', x: 3.4, y: 2.6, label: 'FRAUD', predicted: 'LEGITIMATE', uncertainty: 0.51, amount: 1250, merchant: 'LuxuryWatches', isOutlier: true },
  { id: 'u-5', x: 2.0, y: 1.8, label: 'LEGITIMATE', predicted: 'LEGITIMATE', uncertainty: 0.39, amount: 620, merchant: 'CarRental' },
  { id: 'u-6', x: 2.9, y: 1.1, label: 'LEGITIMATE', predicted: 'LEGITIMATE', uncertainty: 0.43, amount: 940, merchant: 'FurnitureDirect' },

  // Legitimate Core Cluster (Bottom Left, x: -5.0 to -1.0, y: -4.0 to 0.0)
  { id: 'l-1', x: -3.2, y: -2.1, label: 'LEGITIMATE', predicted: 'LEGITIMATE', uncertainty: 0.02, amount: 14.50, merchant: 'Starbucks' },
  { id: 'l-2', x: -2.8, y: -1.6, label: 'LEGITIMATE', predicted: 'LEGITIMATE', uncertainty: 0.01, amount: 84.50, merchant: 'Whole Foods' },
  { id: 'l-3', x: -3.8, y: -2.8, label: 'LEGITIMATE', predicted: 'LEGITIMATE', uncertainty: 0.03, amount: 45.00, merchant: 'Shell Gas' },
  { id: 'l-4', x: -2.1, y: -1.2, label: 'LEGITIMATE', predicted: 'LEGITIMATE', uncertainty: 0.02, amount: 28.40, merchant: 'Uber' },
  { id: 'l-5', x: -4.1, y: -3.1, label: 'LEGITIMATE', predicted: 'LEGITIMATE', uncertainty: 0.01, amount: 12.99, merchant: 'Netflix' },
  { id: 'l-6', x: -1.9, y: -0.8, label: 'LEGITIMATE', predicted: 'LEGITIMATE', uncertainty: 0.04, amount: 110.00, merchant: 'Target' },
  { id: 'l-7', x: -3.5, y: -1.9, label: 'LEGITIMATE', predicted: 'LEGITIMATE', uncertainty: 0.02, amount: 65.20, merchant: 'CVS Pharmacy' },
  { id: 'l-8', x: -2.5, y: -2.5, label: 'LEGITIMATE', predicted: 'LEGITIMATE', uncertainty: 0.01, amount: 33.10, merchant: 'Trader Joes' },
  { id: 'l-9', x: -4.5, y: -2.4, label: 'LEGITIMATE', predicted: 'LEGITIMATE', uncertainty: 0.03, amount: 52.00, merchant: 'ExxonMobil' },
  { id: 'l-10', x: -1.5, y: -1.5, label: 'LEGITIMATE', predicted: 'LEGITIMATE', uncertainty: 0.05, amount: 180.00, merchant: 'Home Depot' }
];

export const MOCK_CALIBRATION_CURVE: CalibrationPoint[] = [
  { bin: 1, binRange: '0.0 - 0.1', meanPredicted: 0.04, fractionOfPositives: 0.038, sampleCount: 4200 },
  { bin: 2, binRange: '0.1 - 0.2', meanPredicted: 0.14, fractionOfPositives: 0.135, sampleCount: 850 },
  { bin: 3, binRange: '0.2 - 0.3', meanPredicted: 0.25, fractionOfPositives: 0.248, sampleCount: 410 },
  { bin: 4, binRange: '0.3 - 0.4', meanPredicted: 0.36, fractionOfPositives: 0.352, sampleCount: 290 },
  { bin: 5, binRange: '0.4 - 0.5', meanPredicted: 0.45, fractionOfPositives: 0.461, sampleCount: 215 },
  { bin: 6, binRange: '0.5 - 0.6', meanPredicted: 0.54, fractionOfPositives: 0.550, sampleCount: 198 },
  { bin: 7, binRange: '0.6 - 0.7', meanPredicted: 0.65, fractionOfPositives: 0.639, sampleCount: 230 },
  { bin: 8, binRange: '0.7 - 0.8', meanPredicted: 0.76, fractionOfPositives: 0.771, sampleCount: 310 },
  { bin: 9, binRange: '0.8 - 0.9', meanPredicted: 0.85, fractionOfPositives: 0.849, sampleCount: 440 },
  { bin: 10, binRange: '0.9 - 1.0', meanPredicted: 0.96, fractionOfPositives: 0.968, sampleCount: 1120 }
];

export const MOCK_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'aud-901',
    timestamp: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
    actor: 'system:risk-management-service',
    actorRole: 'system',
    action: 'DECISION_EVALUATED',
    entity: 'Transaction',
    entityId: 'tx-9942',
    result: 'WARNING',
    correlationId: 'c-8f12a9-e31b-4b',
    ipAddress: '10.244.2.14',
    details: {
      decision: 'PENDING_REVIEW',
      mlProbability: 0.74,
      uncertainty: 0.42,
      reason: 'Model probability 0.74 in boundary band and uncertainty 0.42 exceeds threshold 0.35'
    }
  },
  {
    id: 'aud-900',
    timestamp: new Date(Date.now() - 24 * 60 * 1000 - 300).toISOString(),
    actor: 'system:fastapi-ml-serving',
    actorRole: 'system',
    action: 'ML_INFERENCE_GENERATED',
    entity: 'MlPrediction',
    entityId: 'tx-9942',
    result: 'SUCCESS',
    correlationId: 'c-8f12a9-e31b-4b',
    ipAddress: '10.244.3.8',
    details: {
      modelVersion: 'fraud-model-v3-xgboost',
      latencyMs: 12.4,
      shapComputed: true
    }
  },
  {
    id: 'aud-899',
    timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    actor: 'sarah.chen@fraud-ops.vigilia.com',
    actorRole: 'analyst',
    action: 'CASE_ASSIGNED',
    entity: 'InvestigationCase',
    entityId: 'CASE-2026-080',
    result: 'SUCCESS',
    correlationId: 'c-3300bb-44aa-12',
    ipAddress: '192.168.1.102',
    details: { assignedTo: 'Sarah Chen' }
  },
  {
    id: 'aud-898',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    actor: 'sarah.chen@fraud-ops.vigilia.com',
    actorRole: 'analyst',
    action: 'DECISION_APPROVED',
    entity: 'Transaction',
    entityId: 'tx-9690',
    result: 'SUCCESS',
    correlationId: 'c-0091aa-33bb-77',
    ipAddress: '192.168.1.102',
    diff: {
      field: 'status',
      before: 'PENDING_REVIEW',
      after: 'APPROVED'
    },
    details: {
      reasonCode: 'Customer confirmed',
      notes: 'Customer confirmed online video game subscription purchase via SMS alert callback.'
    }
  },
  {
    id: 'aud-897',
    timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    actor: 'system:risk-management-service',
    actorRole: 'system',
    action: 'DECISION_REJECTED',
    entity: 'Transaction',
    entityId: 'tx-9939',
    result: 'SUCCESS',
    correlationId: 'c-ee9001-ff82-41',
    ipAddress: '10.244.2.14',
    details: {
      decision: 'REJECTED',
      mlProbability: 0.97,
      uncertainty: 0.05,
      reason: 'Confidence exceeds auto-rejection threshold 0.85'
    }
  }
];

export const MOCK_TRACES: DistributedTrace[] = [
  {
    traceId: 'tr-9942-8f12a9',
    correlationId: 'c-8f12a9-e31b-4b',
    endpoint: 'POST /api/v1/transactions',
    timestamp: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
    totalDurationMs: 46.8,
    status: 'OK',
    spans: [
      { service: 'api-gateway', operation: 'JWT Auth & Route Dispatch', durationMs: 4.2, offsetMs: 0, status: 'OK', httpStatus: 200 },
      { service: 'transaction-service', operation: 'Validate & Ingest Transaction', durationMs: 8.5, offsetMs: 4.2, status: 'OK', httpStatus: 200 },
      { service: 'risk-management-service', operation: 'Prepare ML Payload & Evaluate', durationMs: 25.1, offsetMs: 12.7, status: 'OK', httpStatus: 200 },
      { service: 'ml-serving', operation: 'FastAPI /predict + SHAP Explanation', durationMs: 12.4, offsetMs: 18.2, status: 'OK', httpStatus: 200 },
      { service: 'audit-service', operation: 'Asynchronous Audit Ingestion', durationMs: 3.8, offsetMs: 38.0, status: 'OK', httpStatus: 201 },
      { service: 'notification-service', operation: 'Publish Review Alert to Analyst Queue', durationMs: 4.5, offsetMs: 42.0, status: 'OK', httpStatus: 200 }
    ]
  },
  {
    traceId: 'tr-9941-3b91a2',
    correlationId: 'c-3b91a2-99ca-11',
    endpoint: 'POST /api/v1/transactions',
    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    totalDurationMs: 28.5,
    status: 'OK',
    spans: [
      { service: 'api-gateway', operation: 'JWT Auth & Route Dispatch', durationMs: 3.1, offsetMs: 0, status: 'OK', httpStatus: 200 },
      { service: 'transaction-service', operation: 'Validate & Ingest Transaction', durationMs: 6.2, offsetMs: 3.1, status: 'OK', httpStatus: 200 },
      { service: 'risk-management-service', operation: 'Prepare ML Payload & Evaluate', durationMs: 15.3, offsetMs: 9.3, status: 'OK', httpStatus: 200 },
      { service: 'ml-serving', operation: 'FastAPI /predict', durationMs: 8.1, offsetMs: 12.0, status: 'OK', httpStatus: 200 },
      { service: 'audit-service', operation: 'Audit Event Persisted', durationMs: 2.9, offsetMs: 24.8, status: 'OK', httpStatus: 201 }
    ]
  }
];

export const MOCK_MICROSERVICES: MicroserviceHealth[] = [
  {
    name: 'api-gateway',
    displayName: 'API Gateway (Spring Cloud)',
    port: 8080,
    owner: 3,
    status: 'UP',
    liveness: '/actuator/health/liveness',
    readiness: '/actuator/health/readiness',
    uptimeSeconds: 864200,
    replicas: { running: 3, desired: 3 },
    latencyP95Ms: 14.2,
    requestRateRps: 184.5,
    errorRatePercent: 0.02,
    circuitBreaker: 'CLOSED'
  },
  {
    name: 'auth-service',
    displayName: 'Auth Service (JWT)',
    port: 8081,
    owner: 3,
    status: 'UP',
    liveness: '/actuator/health/liveness',
    readiness: '/actuator/health/readiness',
    uptimeSeconds: 864200,
    replicas: { running: 2, desired: 2 },
    latencyP95Ms: 8.4,
    requestRateRps: 42.1,
    errorRatePercent: 0.00,
    circuitBreaker: 'CLOSED'
  },
  {
    name: 'customer-service',
    displayName: 'Customer Service',
    port: 8082,
    owner: 3,
    status: 'UP',
    liveness: '/actuator/health/liveness',
    readiness: '/actuator/health/readiness',
    uptimeSeconds: 864200,
    replicas: { running: 2, desired: 2 },
    latencyP95Ms: 11.2,
    requestRateRps: 65.3,
    errorRatePercent: 0.01,
    circuitBreaker: 'CLOSED'
  },
  {
    name: 'transaction-service',
    displayName: 'Transaction Service',
    port: 8083,
    owner: 3,
    status: 'UP',
    liveness: '/actuator/health/liveness',
    readiness: '/actuator/health/readiness',
    uptimeSeconds: 864200,
    replicas: { running: 4, desired: 4 },
    latencyP95Ms: 18.6,
    requestRateRps: 142.8,
    errorRatePercent: 0.05,
    circuitBreaker: 'CLOSED'
  },
  {
    name: 'risk-management-service',
    displayName: 'Risk Management Engine',
    port: 8084,
    owner: 3,
    status: 'UP',
    liveness: '/actuator/health/liveness',
    readiness: '/actuator/health/readiness',
    uptimeSeconds: 864200,
    replicas: { running: 3, desired: 3 },
    latencyP95Ms: 22.4,
    requestRateRps: 142.8,
    errorRatePercent: 0.08,
    circuitBreaker: 'CLOSED'
  },
  {
    name: 'notification-service',
    displayName: 'Notification Service',
    port: 8085,
    owner: 4,
    status: 'UP',
    liveness: '/actuator/health/liveness',
    readiness: '/actuator/health/readiness',
    uptimeSeconds: 864200,
    replicas: { running: 2, desired: 2 },
    latencyP95Ms: 9.1,
    requestRateRps: 28.4,
    errorRatePercent: 0.00,
    circuitBreaker: 'CLOSED'
  },
  {
    name: 'audit-service',
    displayName: 'Audit & Compliance Service',
    port: 8086,
    owner: 4,
    status: 'UP',
    liveness: '/actuator/health/liveness',
    readiness: '/actuator/health/readiness',
    uptimeSeconds: 864200,
    replicas: { running: 2, desired: 2 },
    latencyP95Ms: 7.8,
    requestRateRps: 180.2,
    errorRatePercent: 0.00,
    circuitBreaker: 'CLOSED'
  },
  {
    name: 'ml-serving',
    displayName: 'ML Serving (FastAPI + XGBoost)',
    port: 8000,
    owner: 2,
    status: 'UP',
    liveness: '/health/live',
    readiness: '/health/ready',
    uptimeSeconds: 864200,
    replicas: { running: 4, desired: 4 },
    latencyP95Ms: 12.8,
    requestRateRps: 142.8,
    errorRatePercent: 0.02,
    circuitBreaker: 'CLOSED'
  }
];

export const MOCK_MODEL_SNAPSHOTS: ModelMetricSnapshot[] = [
  {
    name: 'XGBoost Fraud Champion',
    version: 'fraud-model-v3-xgboost',
    algorithm: 'Extreme Gradient Boosting (XGBoost)',
    trainedAt: '2026-10-18T14:00:00Z',
    deployedAt: '2026-10-20T09:30:00Z',
    status: 'CHAMPION',
    accuracy: 0.9984,
    precision: 0.924,
    recall: 0.892,
    f1: 0.908,
    rocAuc: 0.9842,
    prAuc: 0.8974,
    mcc: 0.907,
    brierScore: 0.0028,
    inferenceTimeMs: 12.4,
    driftPValue: 0.382,
    driftStatus: 'STABLE'
  },
  {
    name: 'Random Forest Ensemble',
    version: 'fraud-model-v2-rf',
    algorithm: 'Random Forest (100 Trees)',
    trainedAt: '2026-10-15T11:00:00Z',
    deployedAt: '2026-10-16T10:00:00Z',
    status: 'CANDIDATE',
    accuracy: 0.9978,
    precision: 0.901,
    recall: 0.854,
    f1: 0.877,
    rocAuc: 0.9710,
    prAuc: 0.8640,
    mcc: 0.876,
    brierScore: 0.0039,
    inferenceTimeMs: 18.2,
    driftPValue: 0.294,
    driftStatus: 'STABLE'
  },
  {
    name: 'Multi-Layer Perceptron (MLP)',
    version: 'fraud-model-v1-mlp',
    algorithm: 'Deep MLP Neural Network (3 layers)',
    trainedAt: '2026-10-12T16:00:00Z',
    deployedAt: '2026-10-13T08:00:00Z',
    status: 'ARCHIVED',
    accuracy: 0.9965,
    precision: 0.865,
    recall: 0.832,
    f1: 0.848,
    rocAuc: 0.9580,
    prAuc: 0.8290,
    mcc: 0.847,
    brierScore: 0.0051,
    inferenceTimeMs: 24.5,
    driftPValue: 0.180,
    driftStatus: 'STABLE'
  },
  {
    name: 'Support Vector Machine (RBF)',
    version: 'fraud-model-v1-svm',
    algorithm: 'SVM (Radial Basis Function)',
    trainedAt: '2026-10-10T09:00:00Z',
    deployedAt: '2026-10-11T14:00:00Z',
    status: 'ARCHIVED',
    accuracy: 0.9958,
    precision: 0.842,
    recall: 0.810,
    f1: 0.826,
    rocAuc: 0.9490,
    prAuc: 0.8050,
    mcc: 0.824,
    brierScore: 0.0064,
    inferenceTimeMs: 45.2,
    driftPValue: 0.120,
    driftStatus: 'STABLE'
  },
  {
    name: 'Regularized Logistic Regression',
    version: 'fraud-model-baseline-lr',
    algorithm: 'Logistic Regression (L2 / Ridge)',
    trainedAt: '2026-10-08T08:00:00Z',
    deployedAt: '2026-10-09T10:00:00Z',
    status: 'ARCHIVED',
    accuracy: 0.9942,
    precision: 0.798,
    recall: 0.745,
    f1: 0.771,
    rocAuc: 0.9250,
    prAuc: 0.7580,
    mcc: 0.769,
    brierScore: 0.0089,
    inferenceTimeMs: 4.1,
    driftPValue: 0.090,
    driftStatus: 'STABLE'
  }
];

export const MOCK_ALERTS: SystemAlert[] = [
  {
    id: 'alt-1',
    severity: 'WARNING',
    title: 'High Uncertainty Review Influx',
    message: 'Pending review volume increased by 28% over 1 hour. Conformal prediction uncertainty threshold triggered for consumer electronics.',
    service: 'risk-management-service',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    resolved: false,
    actionUrl: '/analyst/queue'
  },
  {
    id: 'alt-2',
    severity: 'INFO',
    title: 'HPA Autoscaling Pod Scaled',
    message: 'transaction-service pods automatically scaled from 2 to 4 replicas due to sustained >70% CPU demand.',
    service: 'infrastructure-k8s',
    timestamp: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
    resolved: true,
    actionUrl: '/admin/services'
  }
];

