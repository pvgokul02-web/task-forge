import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ActiveTab, Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ProjectsView } from './components/ProjectsView';
import { TasksView } from './components/TasksView';
import { ActivityLogView } from './components/ActivityLogView';
import { AdminPanel } from './components/AdminPanel';
import { TaskDetailsModal } from './components/TaskDetailsModal';
import { CreateTaskModal } from './components/CreateTaskModal';
import { CreateProjectModal } from './components/CreateProjectModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { UserProfileModal } from './components/UserProfileModal';
import { Project, Task, Activity, DashboardStats, TaskStatus } from './types';

function AppContent() {
  const { currentUser, users, refreshUsers } = useAuth();

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');

  // Data states
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Modal states
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Data loading
  const fetchData = async () => {
    try {
      const [projRes, taskRes, actRes, statsRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/tasks'),
        fetch('/api/activity'),
        fetch('/api/stats'),
      ]);

      if (projRes.ok) setProjects(await projRes.json());
      if (taskRes.ok) setTasks(await taskRes.json());
      if (actRes.ok) setActivities(await actRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.error('Error fetching application data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Action handlers
  const handleCreateProject = async (projectData: any) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...projectData,
          actorName: currentUser?.name || 'System User',
          actorId: currentUser?.id || 'u-1',
          actorAvatar: currentUser?.avatar || '',
        }),
      });

      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskData,
          actorName: currentUser?.name || 'System User',
          actorId: currentUser?.id || 'u-1',
          actorAvatar: currentUser?.avatar || '',
        }),
      });

      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updates,
          actorName: currentUser?.name || 'System User',
          actorId: currentUser?.id || 'u-1',
          actorAvatar: currentUser?.avatar || '',
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask(updated);
        }
        await fetchData();
      }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    await handleUpdateTask(taskId, { status: newStatus });
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actorName: currentUser?.name || 'System User',
          actorId: currentUser?.id || 'u-1',
          actorAvatar: currentUser?.avatar || '',
        }),
      });

      if (res.ok) {
        setSelectedTask(null);
        await fetchData();
      }
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleAddComment = async (taskId: string, content: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          userId: currentUser?.id || 'u-1',
          userName: currentUser?.name || 'System User',
          userAvatar: currentUser?.avatar || '',
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask(updated);
        }
        await fetchData();
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleResetDatabase = async () => {
    if (confirm('Are you sure you want to reset TaskForge data back to initial seed data?')) {
      try {
        const res = await fetch('/api/reset', { method: 'POST' });
        if (res.ok) {
          await refreshUsers();
          await fetchData();
        }
      } catch (err) {
        console.error('Error resetting database:', err);
      }
    }
  };

  const urgentCount = tasks.filter((t) => t.priority === 'Urgent' && t.status !== 'Completed').length;

  return (
    <div className="min-h-screen bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased">
      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCreateTask={() => setShowCreateTask(true)}
        onOpenCreateProject={() => setShowCreateProject(true)}
        onOpenAIAssistant={() => setShowAIAssistant(true)}
        onOpenProfile={() => setShowProfileModal(true)}
        onResetDatabase={handleResetDatabase}
      />

      {/* Main App Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab === 'ai') {
              setShowAIAssistant(true);
            } else {
              setActiveTab(tab);
            }
          }}
          taskCount={tasks.length}
          urgentCount={urgentCount}
        />

        {/* Dynamic View Workspace */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              projects={projects}
              tasks={tasks}
              activities={activities}
              onNavigateTab={(tab) => setActiveTab(tab as ActiveTab)}
              onOpenTaskDetails={(task) => setSelectedTask(task)}
              onOpenCreateTask={() => setShowCreateTask(true)}
              onOpenCreateProject={() => setShowCreateProject(true)}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsView
              projects={projects}
              tasks={tasks}
              users={users}
              onOpenCreateProject={() => setShowCreateProject(true)}
              onSelectProject={(projId) => {
                setSelectedProjectId(projId);
                setActiveTab('tasks');
              }}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksView
              tasks={tasks}
              projects={projects}
              users={users}
              selectedProjectId={selectedProjectId}
              onSelectProjectFilter={(projId) => setSelectedProjectId(projId)}
              onOpenTaskDetails={(task) => setSelectedTask(task)}
              onOpenCreateTask={() => setShowCreateTask(true)}
              onUpdateTaskStatus={handleUpdateTaskStatus}
            />
          )}

          {activeTab === 'activity' && (
            <ActivityLogView activities={activities} />
          )}

          {activeTab === 'admin' && (
            <AdminPanel
              users={users}
              onRefreshUsers={refreshUsers}
              onResetDatabase={handleResetDatabase}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          projects={projects}
          users={users}
          currentUser={currentUser}
          onClose={() => setSelectedTask(null)}
          onUpdateTask={(updates) => handleUpdateTask(selectedTask.id, updates)}
          onDeleteTask={handleDeleteTask}
          onAddComment={handleAddComment}
        />
      )}

      {showCreateTask && (
        <CreateTaskModal
          projects={projects}
          users={users}
          defaultProjectId={selectedProjectId}
          onClose={() => setShowCreateTask(false)}
          onCreateTask={handleCreateTask}
        />
      )}

      {showCreateProject && (
        <CreateProjectModal
          users={users}
          onClose={() => setShowCreateProject(false)}
          onCreateProject={handleCreateProject}
        />
      )}

      {showAIAssistant && (
        <AIAssistantModal onClose={() => setShowAIAssistant(false)} />
      )}

      {showProfileModal && (
        <UserProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
