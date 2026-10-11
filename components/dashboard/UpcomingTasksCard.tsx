'use client';

import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Calendar,
  Plus,
  Filter,
  Trash2,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';

interface TaskData {
  id: string;
  text: string;
  due: string;
  crop: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export function UpcomingTasksCard() {
  const { t } = useTranslation();

  const [tasks, setTasks] = useState<TaskData[]>([
    {
      id: 't1',
      text: t('dashboard.task_irrigation', 'Drip irrigation and canal check'),
      due: 'Today, 4:00 PM',
      crop: 'Field Crop',
      priority: 'high',
      completed: false,
    },
    {
      id: 't2',
      text: t('dashboard.task_fertilizer', 'Apply organic manure and bio-fertilizer'),
      due: 'Tomorrow morning',
      crop: 'Horticulture',
      priority: 'medium',
      completed: false,
    },
    {
      id: 't3',
      text: t('dashboard.task_pest', 'Scout field borders for pest migration'),
      due: 'In 2 days',
      crop: 'Plantation',
      priority: 'low',
      completed: true,
    },
    {
      id: 't4',
      text: t('dashboard.task_harvest', 'Prepare harvest equipment for mature plots'),
      due: 'Friday',
      crop: 'Cash Crop',
      priority: 'high',
      completed: false,
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCrop, setNewTaskCrop] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newTaskDue, setNewTaskDue] = useState('Today');
  const [formError, setFormError] = useState('');

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      setFormError(t('common.field_required', 'Task title is required'));
      return;
    }

    const created: TaskData = {
      id: `task_${Date.now()}`,
      text: newTaskTitle.trim(),
      due: newTaskDue || 'Today',
      crop: newTaskCrop.trim() || 'General Farm',
      priority: newTaskPriority,
      completed: false,
    };

    setTasks([created, ...tasks]);
    setNewTaskTitle('');
    setNewTaskCrop('');
    setNewTaskDue('Today');
    setFormError('');
    setIsAddModalOpen(false);
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle>
            <Calendar className="w-5 h-5 text-emerald-700" />
            {t('dashboard.tasks_card_title', 'Upcoming Farm Tasks')}
          </CardTitle>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs py-1 px-2.5 h-8 text-emerald-800 border-emerald-300 hover:bg-emerald-50"
          >
            <Plus className="w-3.5 h-3.5 mr-1 text-emerald-700" />
            {t('common.add_task', 'Add Task')}
          </Button>

          <Badge variant={pendingCount > 0 ? 'warning' : 'success'} size="sm">
            {pendingCount} {t('common.pending_filter', 'Pending')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Task Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-stone-400 font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {t('common.all_filter', 'All')} ({tasks.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === 'pending'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {t('common.pending_filter', 'Pending')} ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === 'completed'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {t('common.completed_filter', 'Completed')} ({tasks.length - pendingCount})
          </button>
        </div>

        {/* Task Checklist Items */}
        {filteredTasks.length === 0 ? (
          <EmptyState
            title="No tasks in this list"
            description="You have completed all tasks in this filter or none have been added."
            action={
              <Button variant="outline" size="sm" onClick={() => setFilter('all')}>
                {t('common.reset_filter', 'Reset Filter')}
              </Button>
            }
          />
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-3 rounded-xl border transition-all duration-150 flex items-start gap-3 cursor-pointer select-none group ${
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

              <div className="flex-1 space-y-0.5 min-w-0">
                <p
                  className={`text-sm font-semibold truncate ${
                    task.completed ? 'line-through text-stone-500' : 'text-stone-900'
                  }`}
                >
                  {task.text}
                </p>
                <div className="flex items-center gap-2 text-xs text-stone-500 truncate">
                  <span>{task.due}</span>
                  <span>•</span>
                  <span className="text-emerald-800 font-medium">{task.crop}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
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

                <button
                  type="button"
                  onClick={(e) => deleteTask(task.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-600 transition-opacity"
                  title="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </CardContent>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title={t('common.add_task', 'Add New Farm Task')}
          description="Create a task item for your farm schedule."
        >
          <form onSubmit={handleAddTask} className="space-y-3.5 pt-1 text-xs">
            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                {t('common.task_title', 'Task Description')} *
              </label>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="e.g. Inspect soil moisture before fertilizing"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  Target Crop / Plot
                </label>
                <input
                  type="text"
                  value={newTaskCrop}
                  onChange={(e) => setNewTaskCrop(e.target.value)}
                  placeholder="e.g. Banana Plot"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  {t('common.due_date', 'Due Time')}
                </label>
                <input
                  type="text"
                  value={newTaskDue}
                  onChange={(e) => setNewTaskDue(e.target.value)}
                  placeholder="e.g. Today evening / Tomorrow"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Priority
              </label>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            {formError && (
              <p className="text-xs text-rose-600 font-semibold">{formError}</p>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAddModalOpen(false)}
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button type="submit" variant="primary" size="sm">
                {t('common.save', 'Add Task')}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </Card>
  );
}
