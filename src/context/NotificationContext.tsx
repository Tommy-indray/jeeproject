import React, { createContext, useContext, useState } from 'react';
import { SystemAlert } from '../types/contracts';
import { MOCK_ALERTS } from '../services/mockData';

interface Toast {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
}

interface NotificationContextType {
  alerts: SystemAlert[];
  unreadCount: number;
  markAllAsRead: () => void;
  toasts: Toast[];
  showToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<SystemAlert[]>(MOCK_ALERTS);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const unreadCount = alerts.filter(a => !a.resolved).length;

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, resolved: true })));
  };

  const showToast = (type: 'success' | 'warning' | 'error' | 'info', title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ alerts, unreadCount, markAllAsRead, toasts, showToast, removeToast }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};

