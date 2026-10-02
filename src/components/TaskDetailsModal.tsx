import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority, Project, User, Subtask } from '../types';
import { getPriorityBadge, getStatusBadge, formatDate, formatTimeAgo } from '../utils/formatters';
import {
  X,
  Sparkles,
  CheckSquare,
  Plus,
  Trash2,
  Clock,
  User as UserIcon,
  Calendar,
  MessageSquare,
  Tag,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

interface TaskDetailsModalProps {
  task: Task;
  projects: Project[];
  users: User[];
  currentUser: User | null;
  onClose: () => void;
  onUpdateTask: (updatedTask: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onAddComment: (taskId: string, comment: string) => void;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  task,
  projects,
  users,
  currentUser,
  onClose,
  onUpdateTask,
  onDeleteTask,
  onAddComment,
}) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const subtasks = task.subtasks || [];
  const comments = task.comments || [];

  const handleToggleSubtask = (subtask: Subtask) => {
    const updated = subtasks.map((s) => (s.id === subtask.id ? { ...s, completed: !s.completed } : s));
    onUpdateTask({ subtasks: updated });
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const newSub: Subtask = {
      id: 'st-' + Date.now().toString(36),
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    onUpdateTask({ subtasks: [...subtasks, newSub] });
    setNewSubtaskTitle('');
  };

  const handleGenerateAISubtasks = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/ai/subtasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.subtasks && Array.isArray(data.subtasks)) {
          const combined = [...subtasks, ...data.subtasks];
          onUpdateTask({
            subtasks: combined,
            estimatedHours: data.estimatedHours || task.estimatedHours,
          });
        }
      }
    } catch (err) {
      console.error('AI subtask generation error:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(task.id, newComment.trim());
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 my-8">
        {/* Modal Top Bar */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                {task.key}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{task.projectName}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{task.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Task Attributes Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          {/* Status Select */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Status
            </label>
            <select
              value={task.status}
              onChange={(e) => onUpdateTask({ status: e.target.value as TaskStatus })}
              className="w-full px-2 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-xs font-bold text-slate-800 dark:text-slate-100"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="In Review">In Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Priority Select */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Priority
            </label>
            <select
              value={task.priority}
              onChange={(e) => onUpdateTask({ priority: e.target.value as TaskPriority })}
              className="w-full px-2 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-xs font-bold text-slate-800 dark:text-slate-100"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          {/* Assignee Select */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Assignee
            </label>
            <select
              value={task.assigneeId || ''}
              onChange={(e) => onUpdateTask({ assigneeId: e.target.value })}
              className="w-full px-2 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-xs font-bold text-slate-800 dark:text-slate-100"
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={task.dueDate}
              onChange={(e) => onUpdateTask({ dueDate: e.target.value })}
              className="w-full px-2 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-xs font-bold text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Description Section */}
        <div>
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
            Description
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 whitespace-pre-wrap">
            {task.description || 'No detailed description provided.'}
          </p>
        </div>

        {/* Subtasks Checklist Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase flex items-center gap-1.5">
              <CheckSquare className="h-4 w-4 text-blue-600" />
              Subtasks Checklist ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
            </h3>

            <button
              onClick={handleGenerateAISubtasks}
              disabled={isGeneratingAI}
              className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isGeneratingAI ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              )}
              <span>AI Subtask Generator</span>
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {subtasks.map((st) => (
              <div
                key={st.id}
                onClick={() => handleToggleSubtask(st)}
                className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer text-xs"
              >
                <input
                  type="checkbox"
                  checked={st.completed}
                  onChange={() => {}}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span
                  className={`flex-1 ${
                    st.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200 font-medium'
                  }`}
                >
                  {st.title}
                </span>
              </div>
            ))}

            <form onSubmit={handleAddSubtask} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Add new subtask..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                Add
              </button>
            </form>
          </div>
        </div>

        {/* Comments Section */}
        <div>
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-3 flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            Comments & Discussion ({comments.length})
          </h3>

          <div className="space-y-3 max-h-48 overflow-y-auto pr-1 mb-3">
            {comments.map((c) => (
              <div key={c.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <img src={c.userAvatar} alt={c.userName} className="h-5 w-5 rounded-full object-cover" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{c.userName}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{formatTimeAgo(c.timestamp)}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 pl-7">{c.content}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Comment
            </button>
          </form>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm('Delete this task permanently?')) {
                onDeleteTask(task.id);
                onClose();
              }
            }}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            Delete Task
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-300 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
