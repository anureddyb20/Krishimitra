'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { useLocation } from '@/lib/LocationContext';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { getDistrictsForState } from '@/lib/locations';
import { cn } from '@/lib/utils';

interface LocationSelectorProps {
  className?: string;
  size?: 'sm' | 'md';
  showStateLabel?: boolean;
}

export function LocationSelector({
  className,
  size = 'md',
  showStateLabel = true,
}: LocationSelectorProps) {
  const {
    selectedState,
    selectedDistrict,
    setSelectedState,
    setSelectedDistrict,
    availableStates,
    availableDistricts,
    isHydrated,
  } = useLocation();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const activeState = mounted ? selectedState : 'Kerala';
  const activeDistrict = mounted ? selectedDistrict : 'Wayanad';
  const currentDistricts = mounted ? availableDistricts : getDistrictsForState('Kerala');

  return (
    <div suppressHydrationWarning className={cn('inline-flex flex-wrap items-center gap-2', className)}>
      {/* State Dropdown */}
      <div className="relative inline-flex items-center">
        <MapPin className="absolute left-2.5 w-4 h-4 text-emerald-700 pointer-events-none" />
        <select
          suppressHydrationWarning
          value={activeState}
          onChange={(e) => setSelectedState(e.target.value)}
          className={cn(
            'appearance-none pl-8 pr-7 bg-white border border-stone-200 rounded-xl text-stone-900 font-semibold shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer transition-colors hover:border-emerald-300',
            size === 'sm' ? 'py-1.5 text-xs' : 'py-2 text-sm'
          )}
          aria-label="Select State"
        >
          {availableStates.map((st) => (
            <option key={st} value={st} suppressHydrationWarning>
              {st}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 w-3.5 h-3.5 pointer-events-none text-stone-400" />
      </div>

      {/* District Dropdown */}
      <div className="relative inline-flex items-center">
        <select
          suppressHydrationWarning
          value={activeDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className={cn(
            'appearance-none pl-3 pr-7 bg-white border border-stone-200 rounded-xl text-stone-800 font-medium shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer transition-colors hover:border-emerald-300',
            size === 'sm' ? 'py-1.5 text-xs' : 'py-2 text-sm'
          )}
          aria-label="Select District"
        >
          {currentDistricts.map((d) => (
            <option key={d} value={d} suppressHydrationWarning>
              {d} District
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 w-3.5 h-3.5 pointer-events-none text-stone-400" />
      </div>
    </div>
  );
}
