'use client';

import React from 'react';
import { MapPin } from 'lucide-react';
import { KeralaDistrict } from '@/types';
import { cn } from '@/lib/utils';

export const KERALA_DISTRICTS: KeralaDistrict[] = [
  'Alappuzha',
  'Ernakulam',
  'Idukki',
  'Kannur',
  'Kasaragod',
  'Kollam',
  'Kottayam',
  'Kozhikode',
  'Malappuram',
  'Palakkad',
  'Pathanamthitta',
  'Thiruvananthapuram',
  'Thrissur',
  'Wayanad',
];

interface KeralaDistrictSelectorProps {
  value: KeralaDistrict;
  onChange: (district: KeralaDistrict) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export function KeralaDistrictSelector({
  value,
  onChange,
  className,
  size = 'md',
}: KeralaDistrictSelectorProps) {
  return (
    <div className={cn('relative inline-flex items-center', className)}>
      <MapPin className="absolute left-3 w-4 h-4 text-emerald-700 pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as KeralaDistrict)}
        className={cn(
          'appearance-none pl-9 pr-8 bg-white border border-stone-200 rounded-xl text-stone-900 font-medium shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer transition-colors hover:border-stone-300',
          size === 'sm' ? 'py-1.5 text-xs' : 'py-2 text-sm'
        )}
        aria-label="Select Kerala District"
      >
        {KERALA_DISTRICTS.map((d) => (
          <option key={d} value={d}>
            {d} District (കേരളം)
          </option>
        ))}
      </select>
      <div className="absolute right-3 pointer-events-none text-stone-400 text-xs">▼</div>
    </div>
  );
}
