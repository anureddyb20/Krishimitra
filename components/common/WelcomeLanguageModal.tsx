'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, Check, Sparkles, ShieldCheck, User, MapPin } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useLocation } from '@/lib/LocationContext';
import { SupportedLanguage } from '@/types/i18n';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { LocationSelector } from '@/components/common/LocationSelector';

export function WelcomeLanguageModal() {
  const router = useRouter();
  const {
    isOnboardingOpen,
    completeOnboarding,
    supportedLanguages,
    language,
    setLanguage,
    t,
  } = useTranslation();

  const { suggestLocationForLanguage } = useLocation();

  const [farmerName, setFarmerName] = useState('');
  const [nameError, setNameError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOnboardingOpen) return null;

  const handleLanguageSelect = (langCode: SupportedLanguage) => {
    // Immediately update the interface language
    setLanguage(langCode);
    suggestLocationForLanguage(langCode);
  };

  const handleContinue = () => {
    if (isSubmitting) return;

    // Optional field validation
    if (farmerName.trim().length > 0 && farmerName.trim().length < 2) {
      setNameError(t('common.name_validation', 'Name must be at least 2 characters'));
      return;
    }

    setIsSubmitting(true);
    setNameError('');

    if (farmerName.trim()) {
      try {
        localStorage.setItem('krishimitra_farmer_name', farmerName.trim());
      } catch {
        // ignore
      }
    }

    completeOnboarding(language);
    setIsSubmitting(false);
  };

  return (
    <Modal
      isOpen={isOnboardingOpen}
      onClose={handleContinue}
      maxWidth="lg"
      showCloseButton={false}
    >
      <div className="space-y-5">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 mb-1">
            <Globe className="w-8 h-8 text-emerald-700" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {t('welcome_modal.title', 'Welcome to KrishiMitra')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            {t(
              'welcome_modal.subtitle',
              'Select your preferred language to begin. Changing your language immediately updates the interface and suggests regional farming locations.'
            )}
          </p>
        </div>

        {/* 6 Language Choice Grid */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
            {t('welcome_modal.select_prompt', 'Choose your language:')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {supportedLanguages.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`flex flex-col p-3 rounded-2xl border text-left transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/90 shadow-xs ring-2 ring-emerald-500/20'
                      : 'border-stone-200 hover:border-emerald-300 hover:bg-stone-50 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-base font-bold text-stone-900">{lang.name}</span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span>{lang.englishName}</span>
                    {lang.badge && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-semibold">
                        {lang.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Location Confirmation */}
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              {t('common.select_location', 'Confirm Your State & District:')}
            </span>
            <span className="text-[10px] text-stone-500">Can change anytime</span>
          </div>
          <LocationSelector size="sm" />
        </div>

        {/* Optional Farmer Name Input */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-stone-400" />
            <span>{language === 'ml' ? 'കർഷകന്റെ പേര് (ആവശ്യമെങ്കിൽ):' : 'Farmer Name (Optional):'}</span>
          </label>
          <input
            type="text"
            value={farmerName}
            onChange={(e) => {
              setFarmerName(e.target.value);
              if (nameError) setNameError('');
            }}
            placeholder={language === 'ml' ? 'ഉദാ. രമേഷ് കുമാർ' : 'e.g. Ramesh Kumar'}
            className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
          {nameError && (
            <p className="text-xs text-rose-600 font-medium mt-1">{nameError}</p>
          )}
        </div>

        <div className="rounded-xl bg-emerald-50/60 p-3 border border-emerald-200/60 text-xs text-emerald-950 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {t(
              'common.language_note',
              'Language preference is saved on your device. Changing language does not alter your farm records or location.'
            )}
          </p>
        </div>

        <div className="pt-1">
          <Button
            size="lg"
            className="w-full text-base py-3.5 rounded-2xl"
            onClick={handleContinue}
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {t('welcome_modal.continue_btn', 'Proceed to KrishiMitra')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
