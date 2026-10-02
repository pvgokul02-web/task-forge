import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority, Project, User } from '../types';
import { getPriorityBadge, getStatusBadge, formatDate } from '../utils/formatters';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Kanban,
  List,
  Clock,
  CheckCircle2,
  Calendar,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface TasksViewProps {
  tasks: Task[];
  projects: Project[];
  users: User[];
  selectedProjectId: string;
  onSelectProjectFilter: (projectId: string) => void;
  onOpenTaskDetails: (task: Task) => void;
  onOpenCreateTask: () => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
}

const KANBAN_COLUMNS: { status: TaskStatus; title: string; color: string }[] = [
  { status: 'To Do', title: 'To Do', color: 'border-slate-400' },
  { status: 'In Progress', title: 'In Progress', color: 'border-sky-500' },
  { status: 'In Review', title: 'In Review', color: 'border-purple-500' },
  { status: 'Completed', title: 'Completed', color: 'border-emerald-500' },
];

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  projects,
  users,
  selectedProjectId,
  onSelectProjectFilter,
  onOpenTaskDetails,
  onOpenCreateTask,
  onUpdateTaskStatus,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredTasks = tasks.filter((t) => {
    const matchesProject = !selectedProjectId || t.projectId === selectedProjectId;
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === 'All' || t.assigneeId === assigneeFilter;
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;

    return matchesProject && matchesSearch && matchesPriority && matchesAssignee && matchesStatus;
  });

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-blue-600" />
            Task Management & Kanban
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track workflow statuses, assign team owners, and move tasks across sprint stages.
          </p>
        </div>

        <button
          onClick={onOpenCreateTask}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Create Task
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
          {/* Search Box */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search task title, key, tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* Project Filter */}
          <select
            value={selectedProjectId}
            onChange={(e) => onSelectProjectFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.key}: {p.name}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Assignee Filter */}
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="All">All Assignees</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>

        {/* Kanban vs List Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg shrink-0">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'kanban'
                ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Kanban className="h-3.5 w-3.5" />
            <span>Board</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* Main Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {KANBAN_COLUMNS.map((col) => {
            const columnTasks = filteredTasks.filter((t) => t.status === col.status);

            return (
              <div
                key={col.status}
                className="bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className={`flex items-center justify-between pb-3 mb-3 border-b-2 ${col.color}`}>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {col.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                {/* Task Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                  {columnTasks.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                      No tasks in {col.title}
                    </div>
                  ) : (
                    columnTasks.map((task) => {
                      const priority = getPriorityBadge(task.priority);
                      const isOverdue = task.dueDate < today && task.status !== 'Completed';
                      const subtaskDone = task.subtasks?.filter((s) => s.completed).length || 0;
                      const subtaskTotal = task.subtasks?.length || 0;

                      return (
                        <div
                          key={task.id}
                          onClick={() => onOpenTaskDetails(task)}
                          className="bg-white dark:bg-slate-800/90 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700 shadow-xs hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer group"
                        >
                          {/* Key & Priority */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[11px] font-mono font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                              {task.key}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${priority.bg}`}>
                              {priority.label}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                            {task.title}
                          </h4>

                          {/* Tags */}
                          {task.tags && task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 my-2">
                              {task.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 text-[9px] font-semibold"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Footer Info */}
                          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2 text-[10px] text-slate-500">
                            {/* Due Date */}
                            <div className={`flex items-center gap-1 font-semibold ${isOverdue ? 'text-rose-600 dark:text-rose-400' : ''}`}>
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(task.dueDate)}</span>
                            </div>

                            {/* Subtask Ratio */}
                            {subtaskTotal > 0 && (
                              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded font-bold">
                                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                <span>{subtaskDone}/{subtaskTotal}</span>
                              </div>
                            )}

                            {/* Assignee Avatar */}
                            {task.assigneeAvatar ? (
                              <img
                                src={task.assigneeAvatar}
                                alt={task.assigneeName || 'Assignee'}
                                title={`Assigned to ${task.assigneeName}`}
                                className="h-5 w-5 rounded-full object-cover border border-slate-200"
                              />
                            ) : (
                              <div className="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[9px] font-bold">
                                ?
                              </div>
                            )}
                          </div>

                          {/* Quick Move Button */}
                          <div className="mt-2 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {col.status !== 'Completed' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const nextStatus =
                                    col.status === 'To Do'
                                      ? 'In Progress'
                                      : col.status === 'In Progress'
                                      ? 'In Review'
                                      : 'Completed';
                                  onUpdateTaskStatus(task.id, nextStatus);
                                }}
                                className="px-2 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 hover:bg-blue-100 text-[10px] font-bold rounded flex items-center gap-1 cursor-pointer"
                              >
                                Move Next <ArrowRight className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredTasks.map((task) => {
              const priority = getPriorityBadge(task.priority);
              const status = getStatusBadge(task.status);

              return (
                <div
                  key={task.id}
                  onClick={() => onOpenTaskDetails(task)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono font-bold text-slate-400 shrink-0">
                      {task.key}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {task.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{task.projectName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 text-xs">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${priority.bg}`}>
                      {priority.label}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${status.bg}`}>
                      {status.label}
                    </span>
                    <span className="text-slate-400 text-[11px]">Due {formatDate(task.dueDate)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
