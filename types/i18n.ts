export type SupportedLanguage = 'ml' | 'en' | 'hi' | 'kn' | 'ta' | 'te';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;        // Native script
  englishName: string; // English script
  flagLabel?: string;
  badge?: string;
}

export type TranslationDictionary = {
  [key: string]: string | TranslationDictionary;
};
