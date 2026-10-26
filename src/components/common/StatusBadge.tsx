import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Activity 
} from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md',
  showIcon = true 
}) => {
  const norm = (status || '').toUpperCase();

  let style = 'bg-slate-100 text-slate-700 border-slate-200';
  let icon = <Activity className="w-3.5 h-3.5 mr-1" />;
  let label = status;

  if (norm === 'APPROVED' || norm === 'LEGITIMATE' || norm === 'UP' || norm === 'RESOLVED' || norm === 'SUCCESS' || norm === 'CONFIRMED_LEGITIMATE' || norm === 'CHAMPION') {
    style = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    icon = <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />;
    label = norm === 'UP' ? 'Healthy' : norm === 'CONFIRMED_LEGITIMATE' ? 'Confirmed by User' : norm === 'APPROVED' ? 'Approved' : norm === 'LEGITIMATE' ? 'Legitimate' : norm;
  } else if (norm === 'REJECTED' || norm === 'FRAUD' || norm === 'DOWN' || norm === 'CRITICAL' || norm === 'FAILURE' || norm === 'REPORTED_FRAUD') {
    style = 'bg-rose-50 text-rose-700 border-rose-200';
    icon = <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />;
    label = norm === 'DOWN' ? 'Offline' : norm === 'REPORTED_FRAUD' ? 'Fraud Reported' : norm === 'REJECTED' ? 'Declined' : norm === 'FRAUD' ? 'Fraud' : norm;
  } else if (norm === 'PENDING_REVIEW' || norm === 'PENDING' || norm === 'IN_REVIEW' || norm === 'WARNING' || norm === 'DEGRADED') {
    style = 'bg-amber-50 text-amber-700 border-amber-200';
    icon = <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />;
    label = norm === 'PENDING_REVIEW' ? 'Under Review' : norm === 'IN_REVIEW' ? 'In Investigation' : norm === 'DEGRADED' ? 'Degraded' : norm;
  } else if (norm === 'HIGH') {
    style = 'bg-red-50 text-red-700 border-red-200 font-semibold';
    icon = <ShieldAlert className="w-3.5 h-3.5 mr-1 text-red-600" />;
    label = 'High Priority';
  } else if (norm === 'MEDIUM') {
    style = 'bg-amber-50 text-amber-700 border-amber-200';
    icon = <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />;
    label = 'Medium Priority';
  } else if (norm === 'LOW') {
    style = 'bg-blue-50 text-blue-700 border-blue-200';
    icon = <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-600" />;
    label = 'Low Priority';
  }

  const sizeClass = size === 'sm' 
    ? 'text-xs px-2 py-0.5' 
    : size === 'lg' 
    ? 'text-sm px-3 py-1.5' 
    : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${style} ${sizeClass}`}>
      {showIcon && icon}
      <span>{label}</span>
    </span>
  );
};

