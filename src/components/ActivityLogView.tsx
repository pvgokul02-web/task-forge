import React, { useState } from 'react';
import { Activity } from '../types';
import { formatTimeAgo, formatDate } from '../utils/formatters';
import {
  History,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  MessageSquare,
  PlusCircle,
  ArrowRight,
  Trash2,
} from 'lucide-react';

interface ActivityLogViewProps {
  activities: Activity[];
}

export const ActivityLogView: React.FC<ActivityLogViewProps> = ({ activities }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('All');

  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      act.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (act.projectName && act.projectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (act.taskTitle && act.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAction = actionFilter === 'All' || act.actionType === actionFilter;

    return matchesSearch && matchesAction;
  });

  const getActionBadge = (actionType: Activity['actionType']) => {
    switch (actionType) {
      case 'status_changed':
        return {
          bg: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900',
          icon: Clock,
          label: 'Status Shift',
        };
      case 'created':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900',
          icon: PlusCircle,
          label: 'Created',
        };
      case 'commented':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900',
          icon: MessageSquare,
          label: 'Comment',
        };
      case 'assigned':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900',
          icon: User,
          label: 'Reassigned',
        };
      case 'deleted':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900',
          icon: Trash2,
          label: 'Deleted',
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
          icon: History,
          label: 'Updated',
        };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <History className="h-6 w-6 text-blue-600" />
          Workspace Audit & Activity History
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Complete, chronological record of all project creations, task modifications, and status changes.
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by user, task title, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          {['All', 'created', 'status_changed', 'assigned', 'commented', 'deleted'].map((act) => (
            <button
              key={act}
              onClick={() => setActionFilter(act)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-colors cursor-pointer ${
                actionFilter === act
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {act === 'status_changed' ? 'Status Shift' : act}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Feed */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        {filteredActivities.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No activity history logs match your search filter.
          </div>
        ) : (
          <div className="relative pl-6 border-l-2 border-slate-100 dark:border-slate-800 space-y-6">
            {filteredActivities.map((act) => {
              const badge = getActionBadge(act.actionType);
              const BadgeIcon = badge.icon;

              return (
                <div key={act.id} className="relative group">
                  <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-900 flex items-center justify-center text-white">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <img
                        src={act.userAvatar}
                        alt={act.userName}
                        className="h-8 w-8 rounded-full object-cover shrink-0 border border-slate-200"
                      />
                      <div>
                        <p className="text-xs text-slate-800 dark:text-slate-200">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {act.userName}
                          </span>{' '}
                          {act.description}
                        </p>
                        {act.projectName && (
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                            Project: {act.projectName}
                          </p>
                        )}
                        {act.previousValue && act.newValue && (
                          <div className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold">
                            <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              {act.previousValue}
                            </span>
                            <ArrowRight className="h-3 w-3 text-slate-400" />
                            <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                              {act.newValue}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 ${badge.bg}`}>
                        <BadgeIcon className="h-3 w-3" />
                        {badge.label}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formatTimeAgo(act.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
