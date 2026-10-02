import React from 'react';
import { Project, Task, Activity, DashboardStats } from '../types';
import { useAuth } from '../context/AuthContext';
import { getPriorityBadge, getStatusBadge, formatTimeAgo, formatDate } from '../utils/formatters';
import {
  FolderKanban,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
  Users,
  Flame,
  Calendar,
  Activity as ActivityIcon,
} from 'lucide-react';

interface DashboardViewProps {
  stats: DashboardStats | null;
  projects: Project[];
  tasks: Task[];
  activities: Activity[];
  onNavigateTab: (tab: 'projects' | 'tasks' | 'activity' | 'ai') => void;
  onOpenTaskDetails: (task: Task) => void;
  onOpenCreateTask: () => void;
  onOpenCreateProject: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  projects,
  tasks,
  activities,
  onNavigateTab,
  onOpenTaskDetails,
  onOpenCreateTask,
  onOpenCreateProject,
}) => {
  const { currentUser } = useAuth();

  const urgentTasks = tasks.filter((t) => (t.priority === 'Urgent' || t.priority === 'High') && t.status !== 'Completed');
  const today = new Date().toISOString().split('T')[0];
  const overdueTasks = tasks.filter((t) => t.dueDate < today && t.status !== 'Completed');

  const completionRate = stats && stats.totalTasks > 0
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 md:p-8 shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-indigo-500 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Smart Workspace Dashboard</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser?.name || 'Engineer'} 👋
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              You have <span className="font-semibold text-white">{urgentTasks.length} high priority tasks</span> needing attention. Here is your enterprise project health overview.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCreateProject}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 backdrop-blur-md transition-all cursor-pointer flex items-center gap-2"
            >
              <FolderKanban className="h-4 w-4" />
              New Project
            </button>
            <button
              onClick={onOpenCreateTask}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Task
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Projects */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Projects
            </span>
            <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FolderKanban className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats?.totalProjects || 0}
            </span>
            <span className="text-xs font-medium text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" />
              {stats?.activeProjects || 0} In Progress
            </span>
          </div>
        </div>

        {/* Metric 2: Completion Rate */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Completion Rate
            </span>
            <div className="h-9 w-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {completionRate}%
            </span>
            <span className="text-xs text-slate-500">
              ({stats?.completedTasks || 0} of {stats?.totalTasks || 0} tasks)
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Urgent Tasks */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Urgent Priority
            </span>
            <div className="h-9 w-9 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Flame className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats?.urgentTasks || 0}
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              Requires immediate focus
            </span>
          </div>
        </div>

        {/* Metric 4: Overdue Tasks */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Overdue Tasks
            </span>
            <div className="h-9 w-9 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats?.overdueTasks || 0}
            </span>
            <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">
              Past deadline
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Left 2 Cols (Projects & Urgent Tasks), Right 1 Col (Activity Stream) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Projects Showcase */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-blue-600" />
                Active Projects Overview
              </h2>
              <button
                onClick={() => onNavigateTab('projects')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                View All Projects
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => {
                const projectTasks = tasks.filter((t) => t.projectId === project.id);
                const doneCount = projectTasks.filter((t) => t.status === 'Completed').length;
                const prog = projectTasks.length > 0 ? Math.round((doneCount / projectTasks.length) * 100) : 0;

                return (
                  <div
                    key={project.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 hover:border-blue-400 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider"
                          style={{ backgroundColor: project.color }}
                        >
                          {project.key}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                          {project.name}
                        </h3>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {project.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2">
                      {project.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>Progress ({doneCount}/{projectTasks.length} tasks)</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{prog}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${prog}%`, backgroundColor: project.color }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Urgent & High Priority Tasks */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="h-5 w-5 text-rose-500" />
                High Priority & Urgent Tasks
              </h2>
              <button
                onClick={() => onNavigateTab('tasks')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Go to Kanban
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {urgentTasks.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                🎉 No high priority or urgent tasks remaining!
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {urgentTasks.slice(0, 5).map((task) => {
                  const priority = getPriorityBadge(task.priority);
                  const status = getStatusBadge(task.status);

                  return (
                    <div
                      key={task.id}
                      onClick={() => onOpenTaskDetails(task)}
                      className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-mono font-bold text-slate-400 shrink-0">
                          {task.key}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {task.title}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {task.projectName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${priority.bg}`}>
                          {priority.label}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${status.bg}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Activity History Stream */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ActivityIcon className="h-5 w-5 text-indigo-600" />
                Live Activity Stream
              </h2>
              <button
                onClick={() => onNavigateTab('activity')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                All Logs
              </button>
            </div>

            <div className="relative pl-4 border-l-2 border-slate-100 dark:border-slate-800 space-y-4">
              {activities.slice(0, 6).map((act) => (
                <div key={act.id} className="relative group">
                  <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-blue-500 ring-4 ring-white dark:ring-slate-900" />
                  
                  <div className="flex items-start gap-2">
                    <img
                      src={act.userAvatar}
                      alt={act.userName}
                      className="h-6 w-6 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0 text-xs">
                      <p className="text-slate-800 dark:text-slate-200">
                        <span className="font-bold text-slate-900 dark:text-white">{act.userName}</span>{' '}
                        {act.description}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {formatTimeAgo(act.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
