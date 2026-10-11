'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, Send, Sparkles, MessageSquare } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function AIAssistantCard() {
  const { t } = useTranslation();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const samplePrompts = [
    t('dashboard.prompt_1', 'How to manage pest infestation in standing crops?'),
    t('dashboard.prompt_2', 'Current government subsidies for micro-irrigation and solar pumps?'),
    t('dashboard.prompt_3', 'Best organic fertilizer practices for higher crop yield?'),
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/ai-assistant?q=${encodeURIComponent(query)}`);
    } else {
      router.push('/ai-assistant');
    }
  };

  const handleChipClick = (promptText: string) => {
    router.push(`/ai-assistant?q=${encodeURIComponent(promptText)}`);
  };

  return (
    <Card className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white border-emerald-800 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-800/80 text-emerald-200">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-white">
              {t('dashboard.ai_quick_title', 'Ask KrishiMitra AI')}
            </CardTitle>
            <p className="text-xs text-emerald-300/80 mt-0.5">
              {t(
                'dashboard.ai_quick_subtitle',
                'Instant answers for Indian farmers in regional languages and English'
              )}
            </p>
          </div>
        </div>

        <Badge variant="demo" size="sm" className="bg-emerald-800 text-emerald-200 border-emerald-700">
          <Sparkles className="w-3 h-3 inline mr-1 text-amber-300" />
          Phase 2 Preview
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {/* Sample prompt chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-emerald-300/80 uppercase tracking-wider block">
            Suggested Agricultural Questions:
          </span>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((p, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleChipClick(p)}
                className="text-xs bg-emerald-800/60 hover:bg-emerald-800 text-emerald-100 hover:text-white px-3 py-1.5 rounded-lg border border-emerald-700/60 transition-colors text-left flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3 h-3 text-emerald-300 shrink-0" />
                <span className="truncate max-w-xs">{p}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Query Input Box */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(
              'dashboard.ai_input_placeholder',
              'Type or ask a farming question (e.g. കുരുമുളകിലെ ദ്രുതവാട്ടം...)'
            )}
            className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-white placeholder-emerald-300/50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
          />
          <Button
            type="submit"
            variant="accent"
            size="md"
            className="rounded-xl shrink-0"
          >
            <Send className="w-4 h-4 mr-1.5" />
            {t('dashboard.ai_ask_btn', 'Ask AI')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
