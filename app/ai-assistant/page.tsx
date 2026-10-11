'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Bot, Mic, Sparkles, Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

function AIAssistantChatContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [inputText, setInputText] = useState(initialQuery);

  useEffect(() => {
    if (initialQuery) {
      setInputText(initialQuery);
    }
  }, [initialQuery]);

  const sampleConversations = [
    {
      role: 'user',
      text: 'കുരുമുളകിലെ ദ്രുതവാട്ടം തടയാൻ മഴക്കാലത്ത് എന്തെല്ലാം മുൻകരുതലുകൾ എടുക്കണം? (How to prevent quick wilt in black pepper during monsoon?)',
    },
    {
      role: 'assistant',
      text: 'ദ്രുതവാട്ടം (Phytophthora foot rot) തടയാൻ പ്രധാന മുൻകരുതലുകൾ:\n1. തോട്ടത്തിൽ വെള്ളം കെട്ടിനിൽക്കാതെ നീർവാർച്ച ഉറപ്പാക്കുക.\n2. വള്ളികളുടെ ചുവട്ടിൽ 1% ബോർഡോ മിശ്രിതം അല്ലെങ്കിൽ കോപ്പർ ഓക്സിക്ലോറൈഡ് (0.2%) തളിക്കുക.\n3. ട്രൈക്കോഡെർമ (Trichoderma) സമ്പുഷ്ടമാക്കിയ ചാണകപ്പൊടി മെയ്-ജൂൺ മാസങ്ങളിൽ തടത്തിൽ ചേർക്കുക.\n4. താഴെയുള്ള ശാഖകൾ നിലത്തുതട്ടാതെ വെട്ടിനിർത്തുക.',
      badge: 'Simulated AI Response for Kerala Agro-Climatic Zone',
    },
  ];

  return (
    <Card className="border-stone-200 overflow-hidden shadow-sm">
      <div className="bg-stone-50 border-b border-stone-200 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-bold text-stone-900 block">KrishiMitra AI Bot</span>
            <span className="text-[11px] text-stone-500">
              Kerala Agricultural University (KAU) Advisory Model
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Interface Ready
        </div>
      </div>

      <CardContent className="p-6 space-y-4 min-h-[300px] bg-stone-50/30">
        {sampleConversations.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-xl p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-emerald-700 text-white rounded-tr-xs'
                  : 'bg-white border border-stone-200 text-stone-800 rounded-tl-xs shadow-xs'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
              {msg.badge && (
                <span className="inline-block mt-3 text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold px-2 py-0.5 rounded-full">
                  {msg.badge}
                </span>
              )}
            </div>
          </div>
        ))}

        {inputText && inputText !== sampleConversations[0].text && (
          <div className="flex flex-col items-end">
            <div className="max-w-xl p-4 rounded-2xl text-sm bg-emerald-700 text-white rounded-tr-xs">
              {inputText}
            </div>
            <span className="text-[11px] text-stone-400 mt-1 italic">
              (Phase 1 demonstration input)
            </span>
          </div>
        )}
      </CardContent>

      {/* Input Bar */}
      <div className="p-4 bg-white border-t border-stone-200 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask a farming question in Malayalam or English..."
            className="flex-1 px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Button variant="outline" size="md" className="shrink-0 text-stone-600">
            <Mic className="w-4 h-4 mr-1.5 text-stone-500" />
            <span className="hidden sm:inline">Voice (Phase 2)</span>
          </Button>
          <Button variant="primary" size="md" className="shrink-0">
            <Send className="w-4 h-4 mr-1.5" />
            Send
          </Button>
        </div>
        <p className="text-[11px] text-stone-400 text-center">
          Live AI responses will be active once Gemini API credentials are configured in Phase 2.
        </p>
      </div>
    </Card>
  );
}

export default function AIAssistantPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back button and page title */}
      <div className="space-y-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-xs font-semibold text-stone-500 hover:text-emerald-700 transition-colors gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('common.back', 'Back to Dashboard')}
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                {t('modules.ai_assistant_title', 'AI Farming Assistant')}
              </h1>
              <Badge variant="demo" size="sm">
                <Sparkles className="w-3 h-3 inline mr-1" />
                Phase 2 Blueprint
              </Badge>
            </div>
            <p className="text-sm text-stone-600 mt-1">
              {t(
                'modules.ai_assistant_subtitle',
                'Bilingual conversational intelligence powered by Gemini LLM with agricultural knowledge retrieval (RAG).'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Planned Architecture Notice */}
      <AlertBanner
        type="info"
        title="Module Status: Planned for Phase 2"
        message="Live LLM generation using the Google Gemini API with Malayalam speech-to-text (STT) and text-to-speech (TTS) will be integrated in Phase 2. Below is an interactive demonstration of the conversational interface."
      />

      <Suspense
        fallback={
          <div className="p-8 bg-white rounded-2xl border border-stone-200 space-y-4">
            <LoadingSkeleton className="h-8 w-48" />
            <LoadingSkeleton className="h-32 w-full" />
          </div>
        }
      >
        <AIAssistantChatContent />
      </Suspense>
    </div>
  );
}
