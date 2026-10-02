import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Layers,
  Search,
  Plus,
  RotateCcw,
  UserCheck,
  Shield,
  Sparkles,
  ChevronDown,
  User as UserIcon,
  Bell,
  LogOut,
} from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCreateTask: () => void;
  onOpenCreateProject: () => void;
  onOpenAIAssistant: () => void;
  onOpenProfile: () => void;
  onResetDatabase: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenCreateTask,
  onOpenCreateProject,
  onOpenAIAssistant,
  onOpenProfile,
  onResetDatabase,
}) => {
  const { currentUser, users, switchUser } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between shadow-xs">
      {/* Left: Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <Layers className="h-5 w-5 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
              TaskForge
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
              v2.0
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Smart Project Management
          </p>
        </div>
      </div>

      {/* Middle: Global Search */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects, tasks (e.g. TF-101) or tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-blue-500 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden transition-all"
          />
        </div>
      </div>

      {/* Right Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Gemini AI Assistant Button */}
        <button
          onClick={onOpenAIAssistant}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 text-xs font-medium transition-colors cursor-pointer"
          title="Ask TaskForge AI Manager"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="hidden sm:inline">AI Assist</span>
        </button>

        {/* Quick Create Task */}
        <button
          onClick={onOpenCreateTask}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Task</span>
        </button>

        {/* Fast Account Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-medium transition-colors cursor-pointer"
            title="Switch User Role"
          >
            <UserCheck className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden lg:inline">Switch Persona</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {roleSwitcherOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
              <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Active User
                </p>
              </div>
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    switchUser(u.id);
                    setRoleSwitcherOpen(false);
                  }}
                  className={`w-full px-3 py-2 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer ${
                    currentUser?.id === u.id ? 'bg-blue-50/60 dark:bg-blue-950/40' : ''
                  }`}
                >
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="h-8 w-8 rounded-full object-cover border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {u.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <span className="font-medium text-blue-600 dark:text-blue-400">{u.role}</span> • {u.department}
                    </p>
                  </div>
                  {currentUser?.id === u.id && (
                    <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Current User Profile Dropdown */}
        {currentUser && (
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-slate-200 dark:hover:ring-slate-800 transition-all cursor-pointer"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-8 w-8 rounded-full object-cover border-2 border-blue-500/30"
              />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {currentUser.email}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                      {currentUser.role}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {currentUser.department}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onOpenProfile();
                    setUserDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-left cursor-pointer"
                >
                  <UserIcon className="h-4 w-4 text-slate-400" />
                  My Profile & Settings
                </button>

                <button
                  onClick={() => {
                    onResetDatabase();
                    setUserDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2 text-left cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4 text-amber-500" />
                  Reset Sample Data
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
