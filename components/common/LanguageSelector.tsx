'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { SupportedLanguage } from '@/types/i18n';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  variant?: 'header' | 'modal' | 'minimal';
  className?: string;
}

export function LanguageSelector({ variant = 'header', className }: LanguageSelectorProps) {
  const { language, setLanguage, supportedLanguages, currentLanguageInfo } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn('relative inline-block text-left', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={cn(
          'inline-flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500',
          variant === 'header'
            ? 'bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 shadow-xs'
            : 'bg-white hover:bg-stone-50 text-stone-900 border border-stone-300'
        )}
      >
        <span className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-700" />
          <span className="font-semibold">{currentLanguageInfo.name}</span>
          <span className="text-xs text-stone-500 font-normal">({currentLanguageInfo.englishName})</span>
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-stone-500 transition-transform duration-200',
            isOpen && 'transform rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Select Language"
          className="absolute right-0 mt-2 w-72 origin-top-right rounded-2xl bg-white p-2 shadow-xl border border-stone-200 ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-stone-500 border-b border-stone-100 mb-1">
            Choose Language / ഭാഷ തിരഞ്ഞെടുക്കുക
          </div>

          <div className="space-y-1">
            {supportedLanguages.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(lang.code)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer group',
                    isSelected
                      ? 'bg-emerald-50 text-emerald-950 font-medium'
                      : 'hover:bg-stone-50 text-stone-800'
                  )}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold group-hover:text-emerald-700">
                        {lang.name}
                      </span>
                      {lang.badge && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md font-medium">
                          {lang.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-stone-500">{lang.englishName}</span>
                  </div>

                  {isSelected && (
                    <div className="h-6 w-6 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-stone-100 px-3 py-1 text-[11px] text-stone-500 text-center">
            Language selection persists across visits
          </div>
        </div>
      )}
    </div>
  );
}
