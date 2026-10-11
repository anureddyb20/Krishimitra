import { LanguageInfo, SupportedLanguage } from '@/types/i18n';

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'ml',
    name: 'മലയാളം',
    englishName: 'Malayalam',
    flagLabel: 'KL',
    badge: 'കേരളം പ്രാഥമികം',
  },
  {
    code: 'en',
    name: 'English',
    englishName: 'English',
    flagLabel: 'EN',
  },
  {
    code: 'hi',
    name: 'हिन्दी',
    englishName: 'Hindi',
    flagLabel: 'HI',
  },
  {
    code: 'kn',
    name: 'ಕನ್ನಡ',
    englishName: 'Kannada',
    flagLabel: 'KN',
  },
  {
    code: 'ta',
    name: 'தமிழ்',
    englishName: 'Tamil',
    flagLabel: 'TA',
  },
  {
    code: 'te',
    name: 'తెలుగు',
    englishName: 'Telugu',
    flagLabel: 'TE',
  },
];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'ml';
export const STORAGE_KEY = 'krishimitra_preferred_lang';
export const ONBOARDING_COMPLETED_KEY = 'krishimitra_onboarding_done';
