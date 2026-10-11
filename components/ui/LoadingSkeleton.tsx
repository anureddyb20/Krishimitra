import React from 'react';
import { cn } from '@/lib/utils';

export function LoadingSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-stone-200/70', className)}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 rounded-2xl border border-stone-200 bg-white space-y-4">
      <div className="flex justify-between items-center">
        <LoadingSkeleton className="h-5 w-32" />
        <LoadingSkeleton className="h-4 w-12 rounded-full" />
      </div>
      <LoadingSkeleton className="h-10 w-24" />
      <LoadingSkeleton className="h-4 w-full" />
      <LoadingSkeleton className="h-4 w-2/3" />
    </div>
  );
}
