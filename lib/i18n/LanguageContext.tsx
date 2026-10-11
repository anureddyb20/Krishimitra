'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { SupportedLanguage, LanguageInfo, TranslationDictionary } from '@/types/i18n';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, STORAGE_KEY, ONBOARDING_COMPLETED_KEY } from './config';

import enLocale from '@/locales/en.json';
import mlLocale from '@/locales/ml.json';
import hiLocale from '@/locales/hi.json';
import knLocale from '@/locales/kn.json';
import taLocale from '@/locales/ta.json';
import teLocale from '@/locales/te.json';

const dictionaries: Record<SupportedLanguage, TranslationDictionary> = {
  en: enLocale as unknown as TranslationDictionary,
  ml: mlLocale as unknown as TranslationDictionary,
  hi: hiLocale as unknown as TranslationDictionary,
  kn: knLocale as unknown as TranslationDictionary,
  ta: taLocale as unknown as TranslationDictionary,
  te: teLocale as unknown as TranslationDictionary,
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  currentLanguageInfo: LanguageInfo;
  supportedLanguages: LanguageInfo[];
  t: (key: string, fallback?: string) => string;
  isReady: boolean;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  completeOnboarding: (lang?: SupportedLanguage) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getNestedValue(obj: TranslationDictionary | undefined, path: string): string | undefined {
  if (!obj) return undefined;
  const parts = path.split('.');
  let current: any = obj;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }

  return typeof current === 'string' ? current : undefined;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
      if (savedLang && ['ml', 'en', 'hi', 'kn', 'ta', 'te'].includes(savedLang)) {
        setLanguageState(savedLang);
      }

      const onboardingDone = localStorage.getItem(ONBOARDING_COMPLETED_KEY);
      if (!onboardingDone) {
        setIsOnboardingOpen(true);
      }
    } catch {
      // localStorage may fail in restricted privacy mode
    } finally {
      setIsReady(true);
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  const completeOnboarding = (selectedLang?: SupportedLanguage) => {
    if (selectedLang) {
      setLanguage(selectedLang);
    }
    setIsOnboardingOpen(false);
    try {
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    } catch {
      // ignore
    }
  };

  const currentLanguageInfo = useMemo(() => {
    return (
      SUPPORTED_LANGUAGES.find((l) => l.code === language) ||
      SUPPORTED_LANGUAGES[0]
    );
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    const currentDict = dictionaries[language];
    const val = getNestedValue(currentDict, key);
    if (val !== undefined) return val;

    // Fallback to English
    const fallbackDict = dictionaries['en'];
    const fallbackVal = getNestedValue(fallbackDict, key);
    if (fallbackVal !== undefined) return fallbackVal;

    // Default return
    return fallback ?? key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        currentLanguageInfo,
        supportedLanguages: SUPPORTED_LANGUAGES,
        t,
        isReady,
        isOnboardingOpen,
        setIsOnboardingOpen,
        completeOnboarding,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
