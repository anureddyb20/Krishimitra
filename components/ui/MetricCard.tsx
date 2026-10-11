import React from 'react';
import { cn } from '@/lib/utils';

export interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  variant?: 'default' | 'emerald' | 'amber' | 'sky' | 'rose';
  className?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  subtitle,
  icon,
  trend,
  variant = 'default',
  className,
}: MetricCardProps) {
  const variantStyles = {
    default: 'bg-white border-stone-200/90 text-stone-900',
    emerald: 'bg-emerald-50/60 border-emerald-200/80 text-emerald-950',
    amber: 'bg-amber-50/60 border-amber-200/80 text-amber-950',
    sky: 'bg-sky-50/60 border-sky-200/80 text-sky-950',
    rose: 'bg-rose-50/60 border-rose-200/80 text-rose-950',
  };

  const iconStyles = {
    default: 'bg-stone-100 text-stone-700',
    emerald: 'bg-emerald-100 text-emerald-800',
    amber: 'bg-amber-100 text-amber-800',
    sky: 'bg-sky-100 text-sky-800',
    rose: 'bg-rose-100 text-rose-800',
  };

  return (
    <div
      className={cn(
        'p-5 rounded-2xl border shadow-sm transition-all duration-200 hover:shadow-md flex flex-col justify-between',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          {title}
        </span>
        {icon && (
          <div className={cn('p-2 rounded-xl flex items-center justify-center', iconStyles[variant])}>
            {icon}
          </div>
        )}
      </div>

      <div className="my-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {value}
          </span>
          {unit && <span className="text-sm font-medium text-stone-600">{unit}</span>}
        </div>
        {subtitle && <p className="text-xs text-stone-500 mt-1">{subtitle}</p>}
      </div>

      {trend && (
        <div className="mt-3 pt-2 border-t border-stone-100 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              'font-semibold flex items-center',
              trend.isPositive ? 'text-emerald-700' : 'text-rose-600'
            )}
          >
            {trend.value}
          </span>
          {trend.label && <span className="text-stone-500">{trend.label}</span>}
        </div>
      )}
    </div>
  );
}
