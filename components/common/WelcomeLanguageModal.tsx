'use client';

import React, { useState } from 'react';
import { Globe, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { SupportedLanguage } from '@/types/i18n';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export function WelcomeLanguageModal() {
  const { isOnboardingOpen, completeOnboarding, supportedLanguages, language, t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(language);

  if (!isOnboardingOpen) return null;

  return (
    <Modal
      isOpen={isOnboardingOpen}
      onClose={() => completeOnboarding(selectedLang)}
      maxWidth="lg"
      showCloseButton={false}
    >
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 mb-1">
            <Globe className="w-8 h-8 text-emerald-700" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {t('welcome_modal.title', 'Welcome to KrishiMitra')}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 max-w-md mx-auto leading-relaxed">
            {t(
              'welcome_modal.subtitle',
              'Select your preferred language to begin. You can change this at any time from the top navigation menu.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {supportedLanguages.map((lang) => {
            const isSelected = selectedLang === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setSelectedLang(lang.code)}
                className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-stone-200 hover:border-emerald-300 hover:bg-stone-50 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-stone-900">{lang.name}</span>
                    {lang.badge && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium">
                        {lang.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-stone-500">{lang.englishName}</span>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-stone-300 bg-white text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-xl bg-stone-50 p-3.5 border border-stone-200 text-xs text-stone-600 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {t(
              'common.language_note',
              'Language preference is saved on your device. Changing language does not alter your farm records or location.'
            )}
          </p>
        </div>

        <div className="pt-2">
          <Button
            size="lg"
            className="w-full text-base py-3.5 rounded-2xl"
            onClick={() => completeOnboarding(selectedLang)}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {t('welcome_modal.continue_btn', 'Proceed to KrishiMitra')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
