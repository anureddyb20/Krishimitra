'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Bot,
  Mic,
  Sparkles,
  Send,
  ArrowLeft,
  RotateCcw,
  Volume2,
  X,
  MessageSquare,
  Loader2,
  CheckCircle2,
  Info,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useLocation } from '@/lib/LocationContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  badge?: string;
  timestamp: string;
}

function AIAssistantChatContent() {
  const { t } = useTranslation();
  const { selectedState, selectedDistrict } = useLocation();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [inputText, setInputText] = useState(initialQuery);
  const [isThinking, setIsThinking] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      text: `Namaste! I am KrishiMitra AI, your dedicated agronomic intelligence assistant. Ask me questions about crop protection, fertilizer schedules, water conservation, market trends, or government schemes tailored for ${selectedDistrict}, ${selectedState}.`,
      badge: `Agri AI Model • ${selectedDistrict}, ${selectedState}`,
      timestamp: 'Just now',
    },
    {
      id: 'm2',
      role: 'user',
      text: 'What is the recommended micronutrient mixture and spray timing for standing crops in this weather?',
      timestamp: 'Just now',
    },
    {
      id: 'm3',
      role: 'assistant',
      text: `Key agronomic guidance for ${selectedDistrict}, ${selectedState}:\n\n1. Foliar Spray Schedule: Apply balanced zinc sulphate (0.5%) + ferrous sulphate (0.2%) along with 0.1% urea during cool morning hours (7:00 AM – 9:30 AM).\n2. Moisture Precaution: Avoid foliar applications if rain is anticipated within 4 hours.\n3. Soil Health Integration: Complement with organic compost or bio-fertilizers (Azospirillum / Phosphobacteria) around the active root zone.\n4. Local Scheme Advisory: In ${selectedState}, check with your local Raitha Samparka Kendra / Krishi Bhavan for subsidized soil conditioner kits.`,
      badge: `Simulated Agronomic Advisory (${selectedDistrict}, ${selectedState})`,
      timestamp: 'Just now',
    },
  ]);

  const quickPrompts = [
    'How to prevent root rot and fungal wilt in standing crops?',
    'Current government subsidy for micro-irrigation & solar pumps?',
    'Best organic foliar spray for vegetative growth stage?',
    'Mandi price forecast and optimal harvesting window?',
  ];

  const handleSend = (queryToSend?: string) => {
    const text = (queryToSend || inputText).trim();
    if (!text || isThinking) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    // Simulate smart agronomic reasoning for Phase 1 demo
    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        text: `Agronomic Guidance for "${text}" in ${selectedDistrict}, ${selectedState}:\n\n• Recommended Practice: Based on local agro-climatic conditions in ${selectedState}, maintain optimal root aeration and monitor soil tensiometer readings.\n• Integrated Pest & Nutrient Management: Use organic neem kernel extracts (5%) or bio-agents prior to chemical interventions.\n• Weather Advisory: Cross-reference with the 3-day rainfall forecast in your KrishiMitra Weather dashboard before spraying.\n\n[Note: This is a Phase 1 simulated demonstration advisory. Real-time Gemini 1.5 Pro inference with RAG vector search across ICAR and State Agricultural University guides will be enabled in Phase 2.]`,
        badge: `Simulated Response • ${selectedDistrict}, ${selectedState}`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, aiReply]);
      setIsThinking(false);
    }, 700);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'm1',
        role: 'assistant',
        text: `Conversation reset. How can KrishiMitra AI assist your farm in ${selectedDistrict}, ${selectedState} today?`,
        badge: `Agri AI Model • ${selectedDistrict}, ${selectedState}`,
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <Card className="border-stone-200 overflow-hidden shadow-sm">
      {/* Voice Roadmap Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <Mic className="w-5 h-5 text-emerald-700" />
                <span>Voice Assistant (Phase 2 & 5 Roadmap)</span>
              </div>
              <button
                type="button"
                onClick={() => setShowVoiceModal(false)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-stone-600">
              <p>
                Voice-first interaction is a core pillar of KrishiMitra. In upcoming phases:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-stone-700">
                <li>
                  <strong>Bhashini & Whisper STT:</strong> Farmers can speak naturally in Malayalam, Kannada, Telugu, Tamil, Hindi, or English.
                </li>
                <li>
                  <strong>Audio Readout (TTS):</strong> Advisories are read aloud in native dialect so farmers can listen in the field without looking at screens.
                </li>
                <li>
                  <strong>Offline Voice Caching:</strong> PWA voice models for low-bandwidth rural zones.
                </li>
              </ul>
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-950 font-medium text-xs">
                Phase 1 currently features text-based interactive conversational preview.
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowVoiceModal(false)}
              >
                Understood
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header bar */}
      <div className="bg-stone-50 border-b border-stone-200 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-bold text-stone-900 block">KrishiMitra Smart Agri AI</span>
            <span className="text-[11px] text-stone-500">
              National Agricultural Research & Extension Advisory Engine
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetChat}
            title="Reset Conversation"
            className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 text-stone-600 text-xs flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Demo Mode Active
          </div>
        </div>
      </div>

      {/* Prompt suggestions pills */}
      <div className="px-4 sm:px-6 py-2.5 bg-stone-100/60 border-b border-stone-200/70 overflow-x-auto flex items-center gap-2">
        <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider shrink-0">
          Try Asking:
        </span>
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q)}
            className="text-xs bg-white hover:bg-emerald-50 hover:border-emerald-300 text-stone-700 hover:text-emerald-950 px-3 py-1 rounded-lg border border-stone-200 transition-colors whitespace-nowrap cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <CardContent className="p-4 sm:p-6 space-y-4 min-h-[350px] max-h-[500px] overflow-y-auto bg-stone-50/30">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-xl p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-emerald-700 text-white rounded-tr-xs shadow-xs'
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
            <span className="text-[10px] text-stone-400 mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {isThinking && (
          <div className="flex flex-col items-start">
            <div className="p-3.5 bg-white border border-stone-200 rounded-2xl rounded-tl-xs text-xs text-stone-600 flex items-center gap-2 shadow-xs">
              <Loader2 className="w-4 h-4 text-emerald-700 animate-spin" />
              <span>
                KrishiMitra AI is formulating agronomic advisory for {selectedDistrict}, {selectedState}...
              </span>
            </div>
          </div>
        )}
      </CardContent>

      {/* Input Bar */}
      <div className="p-4 bg-white border-t border-stone-200 space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask a farming question for ${selectedDistrict}, ${selectedState}...`}
            className="flex-1 px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => setShowVoiceModal(true)}
            className="shrink-0 text-stone-600 hover:text-emerald-700 cursor-pointer"
          >
            <Mic className="w-4 h-4 mr-1.5 text-stone-500" />
            <span className="hidden sm:inline">Voice</span>
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!inputText.trim() || isThinking}
            className="shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4 mr-1.5" />
            Send
          </Button>
        </form>
        <p className="text-[11px] text-stone-400 text-center">
          Phase 1 Interactive Preview • Connected with simulated state knowledge graphs. Live Gemini LLM API in Phase 2.
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
                'Multilingual conversational intelligence powered by Gemini LLM with agricultural knowledge retrieval (RAG).'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Planned Architecture Notice */}
      <AlertBanner
        type="info"
        title="Module Status: Planned for Phase 2"
        message="Live LLM generation using the Google Gemini API with regional speech-to-text (STT) and text-to-speech (TTS) will be integrated in Phase 2. Below is an interactive demonstration of the conversational interface."
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
