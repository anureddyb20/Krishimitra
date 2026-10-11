import { LanguageInfo, SupportedLanguage } from '@/types/i18n';

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    englishName: 'English',
    flagLabel: 'EN',
    badge: 'All India',
  },
  {
    code: 'kn',
    name: 'ಕನ್ನಡ',
    englishName: 'Kannada',
    flagLabel: 'KN',
    badge: 'ಕರ್ನಾಟಕ',
  },
  {
    code: 'te',
    name: 'తెలుగు',
    englishName: 'Telugu',
    flagLabel: 'TE',
    badge: 'ఆంధ్ర & తెలంగాణ',
  },
  {
    code: 'ta',
    name: 'தமிழ்',
    englishName: 'Tamil',
    flagLabel: 'TA',
    badge: 'தமிழ்நாடு',
  },
  {
    code: 'ml',
    name: 'മലയാളം',
    englishName: 'Malayalam',
    flagLabel: 'ML',
    badge: 'കേരളം',
  },
  {
    code: 'hi',
    name: 'हिन्दी',
    englishName: 'Hindi',
    flagLabel: 'HI',
    badge: 'उत्तर व मध्य भारत',
  },
];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
export const STORAGE_KEY = 'krishimitra_preferred_lang';
export const ONBOARDING_COMPLETED_KEY = 'krishimitra_onboarding_done';
