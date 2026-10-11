import React from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'text-center py-10 px-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-stone-50/50',
        className
      )}
    >
      {icon && (
        <div className="p-3.5 rounded-2xl bg-white shadow-xs border border-stone-200 text-stone-500 mb-3.5">
          {icon}
        </div>
      )}
      <h4 className="text-base font-semibold text-stone-800 tracking-tight">
        {title}
      </h4>
      <p className="text-sm text-stone-500 max-w-sm mt-1 mb-4 leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
