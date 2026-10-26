import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Transaction, InvestigationCase, AuditEvent, ThresholdConfig } from '../types/contracts';
import { api } from '../services/api';
import { useNotification } from './NotificationContext';

interface DataContextType {
  transactions: Transaction[];
  cases: InvestigationCase[];
  audits: AuditEvent[];
  thresholds: ThresholdConfig;
  loading: boolean;
  refreshData: () => Promise<void>;
  createTransaction: (payload: any) => Promise<{ transaction: Transaction; reviewRequired: boolean }>;
  submitFeedback: (txId: string, feedback: 'CONFIRMED_LEGITIMATE' | 'REPORTED_FRAUD') => Promise<void>;
  resolveCase: (caseId: string, payload: any) => Promise<void>;
  updateThresholds: (cfg: ThresholdConfig) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cases, setCases] = useState<InvestigationCase[]>([]);
  const [audits, setAudits] = useState<AuditEvent[]>([]);
  const [thresholds, setThresholds] = useState<ThresholdConfig>({ approvalThreshold: 0.2, rejectionThreshold: 0.85, uncertaintyThreshold: 0.35 });
  const [loading, setLoading] = useState<boolean>(true);
  const { showToast } = useNotification();

  const refreshData = useCallback(async () => {
    try {
      const [txs, cs, auds, ths] = await Promise.all([
        api.getTransactions(),
        api.getInvestigationCases(),
        api.getAuditLogs(),
        api.getThresholds()
      ]);
      setTransactions(txs);
      setCases(cs);
      setAudits(auds);
      setThresholds(ths);
    } catch (e) {
      console.error('Error refreshing data', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const createTransaction = async (payload: any) => {
    const res = await api.createTransaction(payload);
    await refreshData();
    if (res.reviewRequired) {
      showToast('warning', 'Transaction Held for Review', `Transaction of $${res.transaction.amount} flagged for human review.`);
    } else if (res.transaction.status === 'APPROVED') {
      showToast('success', 'Transaction Approved', `Processed $${res.transaction.amount} securely.`);
    } else {
      showToast('error', 'Transaction Declined', `High-confidence fraud signal detected.`);
    }
    return res;
  };

  const submitFeedback = async (txId: string, feedback: 'CONFIRMED_LEGITIMATE' | 'REPORTED_FRAUD') => {
    await api.submitCustomerFeedback(txId, feedback);
    await refreshData();
    if (feedback === 'CONFIRMED_LEGITIMATE') {
      showToast('success', 'Thank you', 'Your confirmation has been appended to the security record.');
    } else {
      showToast('warning', 'Card Protected', 'Fraud report recorded. Card lock request queued.');
    }
  };

  const resolveCase = async (caseId: string, payload: any) => {
    await api.resolveCase(caseId, payload);
    await refreshData();
    showToast(
      payload.decision === 'APPROVED' ? 'success' : 'error',
      `Case ${caseId} Resolved`,
      `Marked as ${payload.decision} with reason: ${payload.reasonCode}`
    );
  };

  const updateThresholds = async (cfg: ThresholdConfig) => {
    await api.updateThresholds(cfg);
    await refreshData();
    showToast('info', 'Thresholds Updated', 'Validation metrics and routing rules adjusted.');
  };

  return (
    <DataContext.Provider value={{
      transactions,
      cases,
      audits,
      thresholds,
      loading,
      refreshData,
      createTransaction,
      submitFeedback,
      resolveCase,
      updateThresholds
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};

