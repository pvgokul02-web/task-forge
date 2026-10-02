import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  History,
  Shield,
  Sparkles,
  Users,
  Settings,
  Flame,
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'projects' | 'tasks' | 'activity' | 'admin' | 'ai';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  taskCount: number;
  urgentCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  taskCount,
  urgentCount,
}) => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'Admin';

  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'projects' as ActiveTab,
      label: 'Projects',
      icon: FolderKanban,
      badge: null,
    },
    {
      id: 'tasks' as ActiveTab,
      label: 'Tasks & Kanban',
      icon: CheckSquare,
      badge: taskCount > 0 ? taskCount : null,
      highlightBadge: urgentCount > 0 ? `${urgentCount} Urgent` : null,
    },
    {
      id: 'activity' as ActiveTab,
      label: 'Activity History',
      icon: History,
      badge: null,
    },
    {
      id: 'ai' as ActiveTab,
      label: 'AI Assistant',
      icon: Sparkles,
      badge: 'Gemini',
    },
    {
      id: 'admin' as ActiveTab,
      label: 'Admin Panel',
      icon: Shield,
      badge: !isAdmin ? 'Locked' : null,
      isRestricted: !isAdmin,
    },
  ];

  return (
    <aside className="w-64 bg-slate-50/80 dark:bg-slate-900/60 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0 hidden md:flex">
      {/* Navigation Items */}
      <div className="p-4 space-y-1">
        <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
          Workspace Navigation
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-4 w-4 ${
                    isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.highlightBadge && !isActive && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-1">
                  <Flame className="h-3 w-3 fill-rose-500 text-rose-500" />
                  {item.highlightBadge}
                </span>
              )}

              {item.badge && (
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : item.badge === 'Locked'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/60 border border-blue-100 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {currentUser?.role || 'User'}
            </p>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            Logged in as <span className="font-medium text-slate-700 dark:text-slate-300">{currentUser?.name}</span>
          </p>
        </div>
      </div>
    </aside>
  );
};
