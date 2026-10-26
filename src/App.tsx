import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { DataProvider } from './context/DataContext';
import { Layout } from './components/common/Layout';

// Auth
import { Login } from './pages/auth/Login';

// Customer Pages
import { CustomerHome } from './pages/customer/CustomerHome';
import { CustomerTransactions } from './pages/customer/CustomerTransactions';
import { CustomerTransactionDetails } from './pages/customer/CustomerTransactionDetails';
import { CustomerCheckout } from './pages/customer/CustomerCheckout';
import { CustomerInsights } from './pages/customer/CustomerInsights';

// Analyst Pages
import { AnalystQueue } from './pages/analyst/AnalystQueue';
import { AnalystCaseDetail } from './pages/analyst/AnalystCaseDetail';
import { AnalystModelExplanation } from './pages/analyst/AnalystModelExplanation';
import { AnalystSimilarCases } from './pages/analyst/AnalystSimilarCases';
import { AnalystCaseTimeline } from './pages/analyst/AnalystCaseTimeline';
import { AnalystAnalytics } from './pages/analyst/AnalystAnalytics';

// Admin Pages
import { AdminOperations } from './pages/admin/AdminOperations';
import { AdminServiceHealth } from './pages/admin/AdminServiceHealth';
import { AdminModelHealth } from './pages/admin/AdminModelHealth';
import { AdminThresholdSimulator } from './pages/admin/AdminThresholdSimulator';
import { AdminTraceExplorer } from './pages/admin/AdminTraceExplorer';
import { AdminAuditExplorer } from './pages/admin/AdminAuditExplorer';
import { AdminTrafficSimulator } from './pages/admin/AdminTrafficSimulator';

// Shared
import { NotFound } from './pages/shared/NotFound';

const RoleBasedRedirect: React.FC = () => {
  const { currentRole, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (currentRole === 'customer') return <Navigate to="/customer" replace />;
  if (currentRole === 'analyst') return <Navigate to="/analyst/queue" replace />;
  return <Navigate to="/admin/operations" replace />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <DataProvider>
            <Routes>
              {/* Public Auth */}
              <Route path="/login" element={<Login />} />

              {/* Main Authenticated Layout */}
              <Route path="/" element={<Layout />}>
                <Route index element={<RoleBasedRedirect />} />

                {/* Customer Routes */}
                <Route path="customer" element={<CustomerHome />} />
                <Route path="customer/transactions" element={<CustomerTransactions />} />
                <Route path="customer/transactions/:id" element={<CustomerTransactionDetails />} />
                <Route path="customer/checkout" element={<CustomerCheckout />} />
                <Route path="customer/insights" element={<CustomerInsights />} />

                {/* Analyst Routes */}
                <Route path="analyst" element={<Navigate to="/analyst/queue" replace />} />
                <Route path="analyst/queue" element={<AnalystQueue />} />
                <Route path="analyst/cases/:id" element={<AnalystCaseDetail />} />
                <Route path="analyst/cases/:id/explanation" element={<AnalystModelExplanation />} />
                <Route path="analyst/cases/:id/similar" element={<AnalystSimilarCases />} />
                <Route path="analyst/cases/:id/timeline" element={<AnalystCaseTimeline />} />
                <Route path="analyst/analytics" element={<AnalystAnalytics />} />

                {/* Admin Routes */}
                <Route path="admin" element={<Navigate to="/admin/operations" replace />} />
                <Route path="admin/operations" element={<AdminOperations />} />
                <Route path="admin/services" element={<AdminServiceHealth />} />
                <Route path="admin/models" element={<AdminModelHealth />} />
                <Route path="admin/simulator" element={<AdminThresholdSimulator />} />
                <Route path="admin/traces" element={<AdminTraceExplorer />} />
                <Route path="admin/audit" element={<AdminAuditExplorer />} />
                <Route path="admin/traffic" element={<AdminTrafficSimulator />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </DataProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
};

export default App;

