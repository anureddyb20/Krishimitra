'use client';

import React, { useState } from 'react';
import { CheckSquare, Square, Calendar, Plus } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function UpcomingTasksCard() {
  const { t } = useTranslation();

  const [tasks, setTasks] = useState([
    {
      id: 't1',
      text: t('dashboard.task_irrigation', 'Drip irrigation for Cardamom nursery'),
      due: 'Today, 4:00 PM',
      crop: 'Cardamom',
      priority: 'high',
      completed: false,
    },
    {
      id: 't2',
      text: t('dashboard.task_fertilizer', 'Apply cow dung slurry to ginger beds'),
      due: 'Tomorrow morning',
      crop: 'Ginger',
      priority: 'medium',
      completed: false,
    },
    {
      id: 't3',
      text: t('dashboard.task_pest', 'Inspect rubber trees for powdery mildew'),
      due: 'In 2 days',
      crop: 'Rubber',
      priority: 'low',
      completed: true,
    },
    {
      id: 't4',
      text: t('dashboard.task_harvest', 'Harvest mature Nendran bunches for market'),
      due: 'Friday',
      crop: 'Banana',
      priority: 'high',
      completed: false,
    },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <CardTitle>
            <Calendar className="w-5 h-5 text-emerald-700" />
            {t('dashboard.tasks_card_title', 'Upcoming Farm Tasks')}
          </CardTitle>
        </div>
        <Badge variant={pendingCount > 0 ? 'warning' : 'success'} size="sm">
          {pendingCount} Pending
        </Badge>
      </CardHeader>

      <CardContent className="space-y-2.5">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`p-3 rounded-xl border transition-all duration-150 flex items-start gap-3 cursor-pointer select-none ${
              task.completed
                ? 'bg-stone-50/70 border-stone-200 opacity-60'
                : 'bg-white border-stone-200 hover:border-emerald-300 hover:bg-stone-50/40'
            }`}
          >
            <button
              type="button"
              className="mt-0.5 text-stone-400 hover:text-emerald-700 transition-colors focus:outline-none"
              aria-label="Toggle task completion"
            >
              {task.completed ? (
                <CheckSquare className="w-5 h-5 text-emerald-700" />
              ) : (
                <Square className="w-5 h-5 text-stone-400" />
              )}
            </button>

            <div className="flex-1 space-y-0.5">
              <p
                className={`text-sm font-semibold ${
                  task.completed ? 'line-through text-stone-500' : 'text-stone-900'
                }`}
              >
                {task.text}
              </p>
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span>{task.due}</span>
                <span>•</span>
                <span className="text-emerald-800 font-medium">{task.crop}</span>
              </div>
            </div>

            <Badge
              variant={
                task.priority === 'high'
                  ? 'danger'
                  : task.priority === 'medium'
                  ? 'warning'
                  : 'default'
              }
              size="sm"
            >
              {task.priority}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
