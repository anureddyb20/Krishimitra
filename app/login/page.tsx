'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sprout,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { sanitizeRedirectPath } from '@/lib/supabase/middleware';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextDestination = sanitizeRedirectPath(searchParams.get('next'), '/dashboard');
  const authCallbackError = searchParams.get('error');

  const { t } = useTranslation();
  const { isConfigured, refreshProfile, signInWithDemo } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    authCallbackError ? 'Authentication callback failed or link expired. Please try signing in again.' : ''
  );
  const [successMessage, setSuccessMessage] = useState('');

  const handleFillDemo = () => {
    setEmail('farmer@krishimitra.in');
    setPassword('Krishi@123');
    setErrorMessage('');
  };

  const handleQuickDemo = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const demoProfile = await signInWithDemo('farmer@krishimitra.in', 'Krishi@123');
      setSuccessMessage('Signed in as Demo Farmer! Redirecting to farm setup...');
      setTimeout(() => {
        if (!demoProfile || !demoProfile.onboarding_completed) {
          router.push('/onboarding');
        } else {
          router.push(nextDestination);
        }
        router.refresh();
      }, 400);
    } catch (err: any) {
      setErrorMessage(err.message || 'Demo sign in failed.');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !password) {
      setErrorMessage(t('common.field_required', 'This field is required'));
      return;
    }

    // If Supabase is unconfigured or user enters demo credentials, use demo sign in
    const isDemoEmail =
      email.trim().toLowerCase() === 'farmer@krishimitra.in' ||
      email.trim().toLowerCase() === 'demo@krishimitra.in' ||
      !isConfigured;

    if (isDemoEmail) {
      setIsLoading(true);
      try {
        const demoProfile = await signInWithDemo(email.trim(), password);
        setSuccessMessage('Signed in successfully! Redirecting...');
        setTimeout(() => {
          if (!demoProfile || !demoProfile.onboarding_completed) {
            router.push('/onboarding');
          } else {
            router.push(nextDestination);
          }
          router.refresh();
        }, 400);
        return;
      } catch (err: any) {
        setErrorMessage(err.message || 'Demo sign in failed.');
        setIsLoading(false);
        return;
      }
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setErrorMessage('Could not initialize Supabase connection.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        setSuccessMessage('Signed in successfully! Redirecting...');
        const profile = await refreshProfile();

        if (profile && !profile.onboarding_completed) {
          router.push('/onboarding');
        } else {
          router.push(nextDestination);
        }
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during sign in.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-950 items-center justify-center text-white shadow-md shadow-emerald-900/20 mb-2">
            <Sprout className="w-8 h-8 text-emerald-200" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {t('auth.login_title', 'Sign In to KrishiMitra')}
          </h1>
          <p className="text-sm text-stone-600 max-w-sm mx-auto">
            {t(
              'auth.login_subtitle',
              'Access your farm management ledger, personalized weather advisories, and crops'
            )}
          </p>
        </div>

        {/* Demo Credentials Card */}
        <div className="p-4 bg-emerald-50/80 border border-emerald-200/90 rounded-3xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              Demo Farmer Credentials
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline underline-offset-2 cursor-pointer transition-colors"
            >
              Fill In Form
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-2xl border border-emerald-100 shadow-2xs">
            <div>
              <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">Email</span>
              <span className="font-bold text-emerald-950 truncate block">farmer@krishimitra.in</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">Password</span>
              <span className="font-bold text-emerald-950 truncate block">Krishi@123</span>
            </div>
          </div>

          <Button
            type="button"
            variant="primary"
            onClick={handleQuickDemo}
            disabled={isLoading}
            className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs justify-center cursor-pointer transition-all"
          >
            <Zap className="w-3.5 h-3.5 mr-1 text-emerald-200" />
            One-Click Demo Sign-In
          </Button>
        </div>

        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-sm flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-snug">{errorMessage}</div>
          </div>
        )}

        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-sm flex items-start gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="leading-snug">{successMessage}</div>
          </div>
        )}

        {/* Login Card */}
        <Card className="shadow-lg border-stone-200/90 rounded-3xl p-6 sm:p-8 bg-white">
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  {t('auth.email_label', 'Email Address')}
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
                    placeholder="farmer@krishimitra.in"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-stone-900 placeholder:text-stone-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    {t('auth.password_label', 'Password')}
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                  >
                    {t('auth.forgot_password', 'Forgot Password?')}
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-stone-900 placeholder:text-stone-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 focus:outline-none cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-stone-300 text-emerald-700 focus:ring-emerald-500 cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2.5 block text-xs font-medium text-stone-600 select-none cursor-pointer"
                >
                  {t('auth.remember_me', 'Remember this device')}
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl justify-center font-bold text-sm shadow-sm cursor-pointer"
              >
                {isLoading ? (
                  <span>{t('auth.signing_in', 'Signing In...')}</span>
                ) : (
                  <>
                    <span>{t('auth.sign_in_btn', 'Sign In')}</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Switch to Registration */}
        <div className="text-center text-xs text-stone-600">
          <span>{t('auth.dont_have_account', 'New to KrishiMitra?')}</span>{' '}
          <Link
            href={`/register${nextDestination !== '/dashboard' ? `?next=${encodeURIComponent(nextDestination)}` : ''}`}
            className="font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-2 transition-colors ml-1"
          >
            {t('auth.register_btn', 'Create Farmer Account')}
          </Link>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted Supabase PostgreSQL Authentication</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="animate-pulse text-stone-400 text-sm">Loading...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
