import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AlertBannerProps {
  type?: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  message: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function AlertBanner({
  type = 'info',
  title,
  message,
  action,
  className,
}: AlertBannerProps) {
  const styles = {
    info: {
      container: 'bg-sky-50 border-sky-200 text-sky-950',
      icon: <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />,
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-950',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
    },
    error: {
      container: 'bg-rose-50 border-rose-200 text-rose-950',
      icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />,
    },
    success: {
      container: 'bg-emerald-50 border-emerald-200 text-emerald-950',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
    },
  };

  const selected = styles[type];

  return (
    <div
      className={cn(
        'p-4 rounded-xl border flex items-start gap-3 shadow-xs',
        selected.container,
        className
      )}
    >
      {selected.icon}
      <div className="flex-1 text-sm">
        {title && <h5 className="font-semibold mb-0.5">{title}</h5>}
        <div className="leading-relaxed">{message}</div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
