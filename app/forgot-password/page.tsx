'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sprout,
  ShieldCheck,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const { isConfigured } = useAuth();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successSent, setSuccessSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage(t('common.field_required', 'This field is required'));
      return;
    }

    if (!isConfigured) {
      setErrorMessage(
        t(
          'auth.unconfigured_notice',
          'Supabase is not configured yet. Please configure credentials in .env.local.'
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
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      setSuccessSent(true);
      setIsLoading(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while requesting password reset.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-950 items-center justify-center text-white shadow-md shadow-emerald-900/20 mb-2">
            <Sprout className="w-8 h-8 text-emerald-200" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {t('auth.reset_password_title', 'Reset Your Password')}
          </h1>
          <p className="text-sm text-stone-600 max-w-sm mx-auto">
            {t(
              'auth.reset_password_subtitle',
              'Enter your registered email and we will send you a password recovery link'
            )}
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-sm flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-snug">{errorMessage}</div>
          </div>
        )}

        {successSent ? (
          <Card className="shadow-lg border-stone-200/90 rounded-3xl p-6 sm:p-8 bg-white text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-stone-900">
              {t('auth.verification_email_sent', 'Check Your Email')}
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              We have sent a secure password recovery link to{' '}
              <strong className="text-stone-900">{email}</strong>. Click the link in the email to set a new password.
            </p>
            <div className="pt-2">
              <Link href="/login">
                <Button variant="outline" className="w-full justify-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('auth.back_to_login', 'Back to Sign In')}
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <Card className="shadow-lg border-stone-200/90 rounded-3xl p-6 sm:p-8 bg-white">
            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-5">
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
                      placeholder="farmer@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-stone-900 placeholder:text-stone-400"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl justify-center font-bold text-sm shadow-sm"
                >
                  {isLoading ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <span>{t('auth.send_reset_link', 'Send Password Recovery Link')}</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-xs font-semibold text-stone-500 hover:text-emerald-700 transition-colors gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('auth.back_to_login', 'Back to Sign In')}
          </Link>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secure Password Reset Flow</span>
        </div>
      </div>
    </div>
  );
}
