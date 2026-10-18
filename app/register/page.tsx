'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Lock,
  Mail,
  User,
  Globe,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sprout,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/config';
import { SupportedLanguage } from '@/types/i18n';
import { sanitizeRedirectPath } from '@/lib/supabase/middleware';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextDestination = sanitizeRedirectPath(searchParams.get('next'), '/dashboard');

  const { t, language, setLanguage } = useTranslation();
  const { isConfigured, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(language);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessNotice(null);

    // 1. Validation checks
    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage(t('common.name_validation', 'Farmer name must be at least 2 characters'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage(
        t('auth.password_length_err', 'Password must be at least 6 characters')
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(t('auth.password_mismatch', 'Passwords do not match'));
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage(
        t('auth.terms_required', 'Please accept the terms to continue')
      );
      return;
    }

    if (!isConfigured) {
      setErrorMessage(
        t(
          'auth.unconfigured_notice',
          'Supabase credentials are not yet configured. Please follow SUPABASE_SETUP.md and add keys to .env.local.'
        )
      );
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setErrorMessage('Could not initialize Supabase connection.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            preferred_language: selectedLang,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      // Check if session was returned directly (email confirmation off in Supabase)
      if (data?.session) {
        setLanguage(selectedLang);
        await refreshProfile();
        // Redirect to onboarding
        router.push('/onboarding');
        router.refresh();
      } else if (data?.user && !data.session) {
        // Email confirmation is required by Supabase project
        setSuccessNotice(
          t(
            'auth.check_inbox_notice',
            'Registration successful! Please check your email to confirm your account, then sign in.'
          )
        );
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during registration.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-6">
        {/* Branding & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-950 items-center justify-center text-white shadow-md shadow-emerald-900/20 mb-2">
            <Sprout className="w-8 h-8 text-emerald-200" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {t('auth.register_title', 'Register Farmer Account')}
          </h1>
          <p className="text-sm text-stone-600 max-w-sm mx-auto">
            {t(
              'auth.register_subtitle',
              'Join thousands of farmers managing plots, crops, and advisory with KrishiMitra'
            )}
          </p>
        </div>

        {/* Configuration notice if Supabase env vars are missing */}
        {!isConfigured && (
          <AlertBanner
            type="warning"
            title="Database Configuration Needed"
            message="Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local to enable real database registration."
          />
        )}

        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-sm flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-snug">{errorMessage}</div>
          </div>
        )}

        {successNotice && (
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 text-sm space-y-3 animate-in fade-in shadow-xs">
            <div className="flex items-center gap-2.5 font-bold text-emerald-900 text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              {t('auth.verification_email_sent', 'Verification Email Sent')}
            </div>
            <p className="text-stone-700 leading-relaxed">{successNotice}</p>
            <div className="pt-2">
              <Link href="/login">
                <Button size="sm" variant="primary">
                  {t('auth.back_to_login', 'Go to Sign In')}
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Registration Card */}
        <Card className="shadow-lg border-stone-200/90 rounded-3xl p-6 sm:p-8 bg-white">
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  {t('auth.full_name_label', 'Farmer Full Name')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="e.g. Anand Kumar / ആനന്ദ് കുമാർ"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-stone-900 placeholder:text-stone-400"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  {t('auth.email_label', 'Email Address')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="farmer@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-stone-900 placeholder:text-stone-400"
                  />
                </div>
              </div>

              {/* Preferred Language */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  {t('auth.preferred_language_label', 'Preferred Language')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <select
                    value={selectedLang}
                    onChange={(e) => {
                      const newL = e.target.value as SupportedLanguage;
                      setSelectedLang(newL);
                      setLanguage(newL);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-stone-900 cursor-pointer"
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name} ({lang.englishName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password & Confirm Password in 2 Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    {t('auth.password_label', 'Password')} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Min 6 chars"
                      className="w-full pl-10 pr-9 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-stone-900 placeholder:text-stone-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    {t('auth.confirm_password_label', 'Confirm Password')} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Repeat password"
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-stone-900 placeholder:text-stone-400"
                    />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-stone-300 text-emerald-700 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-stone-600 leading-snug">
                    {t(
                      'auth.terms_agreement',
                      'I agree to the Terms of Service and Privacy Policy for agricultural data protection'
                    )}
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl justify-center font-bold text-sm shadow-sm"
                >
                  {isLoading ? (
                    <span>{t('auth.registering', 'Creating Account...')}</span>
                  ) : (
                    <>
                      <span>{t('auth.register_btn', 'Create Farmer Account')}</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Switch to Login */}
        <div className="text-center text-xs text-stone-600">
          <span>{t('auth.already_have_account', 'Already have an account?')}</span>{' '}
          <Link
            href={`/login${nextDestination !== '/dashboard' ? `?next=${encodeURIComponent(nextDestination)}` : ''}`}
            className="font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-2 transition-colors ml-1"
          >
            {t('auth.sign_in_btn', 'Sign In')}
          </Link>
        </div>

        {/* Security notice */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secure Multi-Tenant Farm Data Isolation</span>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="animate-pulse text-stone-400 text-sm">Loading...</div>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
