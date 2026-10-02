import fs from 'fs';
import path from 'path';
import { User, Project, Task, Activity, DashboardStats } from '../types.js';

interface DatabaseData {
  users: User[];
  projects: Project[];
  tasks: Task[];
  activities: Activity[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'database.json');

const INITIAL_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Alex Vance',
    email: 'alex.vance@taskforge.dev',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Admin',
    department: 'Engineering',
    status: 'Active',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'u-2',
    name: 'Sarah Jenkins',
    email: 'sarah.j@taskforge.dev',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'Project Manager',
    department: 'Product Management',
    status: 'Active',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'u-3',
    name: 'David Chen',
    email: 'david.chen@taskforge.dev',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Developer',
    department: 'Engineering',
    status: 'Active',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'u-4',
    name: 'Maya Patel',
    email: 'maya.patel@taskforge.dev',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role: 'Developer',
    department: 'Frontend Team',
    status: 'Active',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'u-5',
    name: 'Robert Kim',
    email: 'robert.kim@taskforge.dev',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'QA Tester',
    department: 'Quality Assurance',
    status: 'Active',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p-1',
    key: 'TF',
    name: 'TaskForge Web App V2.0',
    description: 'Next-generation project management dashboard with real-time Kanban boards, role-based controls, and AI automation.',
    category: 'Software Development',
    status: 'In Progress',
    color: '#3b82f6', // blue
    memberIds: ['u-1', 'u-2', 'u-3', 'u-4', 'u-5'],
    createdBy: 'Sarah Jenkins',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    startDate: '2026-08-01',
    endDate: '2026-09-15',
    budgetHours: 180,
  },
  {
    id: 'p-2',
    key: 'MOB',
    name: 'Mobile App API Integration',
    description: 'RESTful microservices and authentication backend for iOS and Android enterprise companion apps.',
    category: 'Mobile Backend',
    status: 'In Progress',
    color: '#8b5cf6', // purple
    memberIds: ['u-1', 'u-3', 'u-5'],
    createdBy: 'Alex Vance',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    startDate: '2026-08-05',
    endDate: '2026-10-01',
    budgetHours: 120,
  },
  {
    id: 'p-3',
    key: 'INF',
    name: 'Cloud Infrastructure & Security Audit',
    description: 'Zero-trust network architecture, container hardening, automated backups, and SOC2 compliance validation.',
    category: 'DevOps & Security',
    status: 'Planning',
    color: '#10b981', // emerald
    memberIds: ['u-1', 'u-2'],
    createdBy: 'Alex Vance',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    startDate: '2026-09-01',
    endDate: '2026-11-15',
    budgetHours: 90,
  },
];

const INITIAL_TASKS: Task[] = [
  {
    id: 't-101',
    key: 'TF-101',
    title: 'Implement Interactive Kanban Board with Drag & Drop',
    description: 'Build responsive Kanban columns for To Do, In Progress, In Review, and Completed with smooth drop indicators and status sync.',
    projectId: 'p-1',
    projectName: 'TaskForge Web App V2.0',
    projectKey: 'TF',
    status: 'In Progress',
    priority: 'High',
    assigneeId: 'u-4',
    assigneeName: 'Maya Patel',
    assigneeAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    reporterId: 'u-2',
    reporterName: 'Sarah Jenkins',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tags: ['Frontend', 'React', 'Kanban'],
    estimatedHours: 16,
    loggedHours: 10,
    subtasks: [
      { id: 'st-1', title: 'Design column header components', completed: true },
      { id: 'st-2', title: 'Implement task card state transitions', completed: true },
      { id: 'st-3', title: 'Add quick status change actions', completed: false },
    ],
    comments: [
      {
        id: 'c-1',
        userId: 'u-2',
        userName: 'Sarah Jenkins',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        content: 'Please make sure status badges are high-contrast and accessible in dark/light mode.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 't-102',
    key: 'TF-102',
    title: 'Role-Based Access Control in Admin Panel',
    description: 'Restrict sensitive operations like member deactivation, system logs viewing, and project deletion to Admin role.',
    projectId: 'p-1',
    projectName: 'TaskForge Web App V2.0',
    projectKey: 'TF',
    status: 'In Review',
    priority: 'Urgent',
    assigneeId: 'u-3',
    assigneeName: 'David Chen',
    assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    reporterId: 'u-1',
    reporterName: 'Alex Vance',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tags: ['Backend', 'Security', 'Admin'],
    estimatedHours: 12,
    loggedHours: 11,
    subtasks: [
      { id: 'st-10', title: 'Define RBAC middleware on Express routes', completed: true },
      { id: 'st-11', title: 'Create Admin Panel UI view', completed: true },
      { id: 'st-12', title: 'Add audit logging for role changes', completed: true },
    ],
    comments: [
      {
        id: 'c-2',
        userId: 'u-5',
        userName: 'Robert Kim',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        content: 'Currently testing non-admin user attempt scenarios. Everything looks solid so far.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 't-103',
    key: 'TF-103',
    title: 'Integrated Activity History & Audit Trail Log',
    description: 'Track all project creations, task assignment updates, status transitions, and comments with filterable timelines.',
    projectId: 'p-1',
    projectName: 'TaskForge Web App V2.0',
    projectKey: 'TF',
    status: 'Completed',
    priority: 'Medium',
    assigneeId: 'u-3',
    assigneeName: 'David Chen',
    assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    reporterId: 'u-2',
    reporterName: 'Sarah Jenkins',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tags: ['Audit', 'Fullstack', 'Feature'],
    estimatedHours: 8,
    loggedHours: 8,
    subtasks: [
      { id: 'st-20', title: 'Create activity logging helper on server', completed: true },
      { id: 'st-21', title: 'Design activity feed interface', completed: true },
    ],
    comments: [],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 't-104',
    key: 'MOB-201',
    title: 'OAuth2 & JWT Token Refresh Pipeline',
    description: 'Implement token rotation and secure HTTP-only cookie handlers for mobile client sessions.',
    projectId: 'p-2',
    projectName: 'Mobile App API Integration',
    projectKey: 'MOB',
    status: 'To Do',
    priority: 'High',
    assigneeId: 'u-3',
    assigneeName: 'David Chen',
    assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    reporterId: 'u-1',
    reporterName: 'Alex Vance',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tags: ['API', 'Auth', 'Mobile'],
    estimatedHours: 14,
    loggedHours: 0,
    subtasks: [
      { id: 'st-30', title: 'Setup JWT signing secret config', completed: false },
      { id: 'st-31', title: 'Implement refresh token endpoint', completed: false },
    ],
    comments: [],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 't-105',
    key: 'INF-301',
    title: 'Docker Image Security Scanning & Minimal Base Setup',
    description: 'Configure automated vulnerabilities scanner in build steps and strip unnecessary Linux utilities.',
    projectId: 'p-3',
    projectName: 'Cloud Infrastructure & Security Audit',
    projectKey: 'INF',
    status: 'To Do',
    priority: 'Medium',
    assigneeId: 'u-1',
    assigneeName: 'Alex Vance',
    assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    reporterId: 'u-1',
    reporterName: 'Alex Vance',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tags: ['DevOps', 'Docker', 'Security'],
    estimatedHours: 10,
    loggedHours: 2,
    subtasks: [],
    comments: [],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    taskId: 't-102',
    taskTitle: 'Role-Based Access Control in Admin Panel',
    projectId: 'p-1',
    projectName: 'TaskForge Web App V2.0',
    userId: 'u-3',
    userName: 'David Chen',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    actionType: 'status_changed',
    description: 'changed task status from In Progress to In Review',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    previousValue: 'In Progress',
    newValue: 'In Review',
  },
  {
    id: 'act-2',
    taskId: 't-101',
    taskTitle: 'Implement Interactive Kanban Board with Drag & Drop',
    projectId: 'p-1',
    projectName: 'TaskForge Web App V2.0',
    userId: 'u-2',
    userName: 'Sarah Jenkins',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    actionType: 'commented',
    description: 'added a comment: "Please make sure status badges are high-contrast..."',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'act-3',
    taskId: 't-103',
    taskTitle: 'Integrated Activity History & Audit Trail Log',
    projectId: 'p-1',
    projectName: 'TaskForge Web App V2.0',
    userId: 'u-3',
    userName: 'David Chen',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    actionType: 'status_changed',
    description: 'completed the task',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    previousValue: 'In Review',
    newValue: 'Completed',
  },
  {
    id: 'act-4',
    projectId: 'p-3',
    projectName: 'Cloud Infrastructure & Security Audit',
    userId: 'u-1',
    userName: 'Alex Vance',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    actionType: 'created',
    description: 'created new project "Cloud Infrastructure & Security Audit"',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

class Store {
  private data: DatabaseData;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseData {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.users) && Array.isArray(parsed.projects)) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Error loading database.json, resetting to seed data:', err);
    }

    const seed: DatabaseData = {
      users: INITIAL_USERS,
      projects: INITIAL_PROJECTS,
      tasks: INITIAL_TASKS,
      activities: INITIAL_ACTIVITIES,
    };
    this.saveData(seed);
    return seed;
  }

  private saveData(dataToSave?: DatabaseData) {
    try {
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing to database.json:', err);
    }
  }

  public resetToSeed(): DatabaseData {
    this.data = {
      users: INITIAL_USERS,
      projects: INITIAL_PROJECTS,
      tasks: INITIAL_TASKS,
      activities: INITIAL_ACTIVITIES,
    };
    this.saveData();
    return this.data;
  }

  // --- USERS ---
  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...userData,
      id: 'u-' + (this.data.users.length + 1) + '-' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.saveData();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.saveData();
    return this.data.users[idx];
  }

  public deleteUser(id: string): boolean {
    const initialLen = this.data.users.length;
    this.data.users = this.data.users.filter((u) => u.id !== id);
    if (this.data.users.length !== initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  // --- PROJECTS ---
  public getProjects(): Project[] {
    return this.data.projects;
  }

  public getProjectById(id: string): Project | undefined {
    return this.data.projects.find((p) => p.id === id);
  }

  public createProject(projectData: Omit<Project, 'id' | 'createdAt'>, actorName: string, actorId: string, actorAvatar: string): Project {
    const id = 'p-' + (this.data.projects.length + 1) + '-' + Date.now().toString(36);
    const newProject: Project = {
      ...projectData,
      id,
      createdAt: new Date().toISOString(),
    };
    this.data.projects.unshift(newProject);

    // Record activity
    this.addActivity({
      projectId: id,
      projectName: newProject.name,
      userId: actorId,
      userName: actorName,
      userAvatar: actorAvatar,
      actionType: 'created',
      description: `created project "${newProject.name}"`,
    });

    this.saveData();
    return newProject;
  }

  public updateProject(id: string, updates: Partial<Project>): Project | null {
    const idx = this.data.projects.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.projects[idx] = { ...this.data.projects[idx], ...updates };
    this.saveData();
    return this.data.projects[idx];
  }

  public deleteProject(id: string): boolean {
    this.data.projects = this.data.projects.filter((p) => p.id !== id);
    // Delete associated tasks
    this.data.tasks = this.data.tasks.filter((t) => t.projectId !== id);
    this.saveData();
    return true;
  }

  // --- TASKS ---
  public getTasks(filters?: { projectId?: string; assigneeId?: string; status?: string; search?: string }): Task[] {
    let result = [...this.data.tasks];
    if (!filters) return result;

    if (filters.projectId) {
      result = result.filter((t) => t.projectId === filters.projectId);
    }
    if (filters.assigneeId) {
      result = result.filter((t) => t.assigneeId === filters.assigneeId);
    }
    if (filters.status) {
      result = result.filter((t) => t.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.key.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return result;
  }

  public getTaskById(id: string): Task | undefined {
    return this.data.tasks.find((t) => t.id === id);
  }

  public createTask(taskData: Omit<Task, 'id' | 'key' | 'createdAt' | 'updatedAt'>, actorName: string, actorId: string, actorAvatar: string): Task {
    const project = this.getProjectById(taskData.projectId);
    const keyPrefix = project ? project.key : 'TF';
    const projectTasksCount = this.data.tasks.filter((t) => t.projectId === taskData.projectId).length;
    const taskKey = `${keyPrefix}-${100 + projectTasksCount + 1}`;

    const newTask: Task = {
      ...taskData,
      id: 't-' + Date.now().toString(36),
      key: taskKey,
      projectName: project ? project.name : 'General Project',
      projectKey: keyPrefix,
      subtasks: taskData.subtasks || [],
      comments: taskData.comments || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.tasks.unshift(newTask);

    this.addActivity({
      taskId: newTask.id,
      taskTitle: newTask.title,
      projectId: newTask.projectId,
      projectName: newTask.projectName,
      userId: actorId,
      userName: actorName,
      userAvatar: actorAvatar,
      actionType: 'created',
      description: `created task "${newTask.key}: ${newTask.title}"`,
    });

    this.saveData();
    return newTask;
  }

  public updateTask(id: string, updates: Partial<Task>, actorName: string, actorId: string, actorAvatar: string): Task | null {
    const idx = this.data.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;

    const oldTask = this.data.tasks[idx];
    const updatedTask: Task = {
      ...oldTask,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.data.tasks[idx] = updatedTask;

    // Record activity if status changed
    if (updates.status && updates.status !== oldTask.status) {
      this.addActivity({
        taskId: oldTask.id,
        taskTitle: oldTask.title,
        projectId: oldTask.projectId,
        projectName: oldTask.projectName,
        userId: actorId,
        userName: actorName,
        userAvatar: actorAvatar,
        actionType: 'status_changed',
        description: `changed status of "${oldTask.key}" from ${oldTask.status} to ${updates.status}`,
        previousValue: oldTask.status,
        newValue: updates.status,
      });
    } else if (updates.assigneeId && updates.assigneeId !== oldTask.assigneeId) {
      this.addActivity({
        taskId: oldTask.id,
        taskTitle: oldTask.title,
        projectId: oldTask.projectId,
        projectName: oldTask.projectName,
        userId: actorId,
        userName: actorName,
        userAvatar: actorAvatar,
        actionType: 'assigned',
        description: `reassigned "${oldTask.key}" to ${updates.assigneeName || 'team member'}`,
      });
    }

    this.saveData();
    return updatedTask;
  }

  public deleteTask(id: string, actorName: string, actorId: string, actorAvatar: string): boolean {
    const task = this.getTaskById(id);
    if (!task) return false;

    this.data.tasks = this.data.tasks.filter((t) => t.id !== id);

    this.addActivity({
      projectId: task.projectId,
      projectName: task.projectName,
      userId: actorId,
      userName: actorName,
      userAvatar: actorAvatar,
      actionType: 'deleted',
      description: `deleted task "${task.key}: ${task.title}"`,
    });

    this.saveData();
    return true;
  }

  public addComment(taskId: string, commentContent: string, userId: string, userName: string, userAvatar: string): Task | null {
    const task = this.getTaskById(taskId);
    if (!task) return null;

    const newComment = {
      id: 'c-' + Date.now().toString(36),
      userId,
      userName,
      userAvatar,
      content: commentContent,
      timestamp: new Date().toISOString(),
    };

    task.comments.push(newComment);
    task.updatedAt = new Date().toISOString();

    this.addActivity({
      taskId: task.id,
      taskTitle: task.title,
      projectId: task.projectId,
      projectName: task.projectName,
      userId,
      userName,
      userAvatar,
      actionType: 'commented',
      description: `commented on "${task.key}"`,
    });

    this.saveData();
    return task;
  }

  // --- ACTIVITIES ---
  public getActivities(limit = 50): Activity[] {
    return this.data.activities.slice(0, limit);
  }

  public addActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Activity {
    const newAct: Activity = {
      ...activity,
      id: 'act-' + Date.now().toString(36),
      timestamp: new Date().toISOString(),
    };
    this.data.activities.unshift(newAct);
    if (this.data.activities.length > 200) {
      this.data.activities = this.data.activities.slice(0, 200);
    }
    return newAct;
  }

  // --- DASHBOARD STATS ---
  public getStats(): DashboardStats {
    const today = new Date().toISOString().split('T')[0];
    const totalProjects = this.data.projects.length;
    const activeProjects = this.data.projects.filter((p) => p.status === 'In Progress').length;
    const totalTasks = this.data.tasks.length;
    const completedTasks = this.data.tasks.filter((t) => t.status === 'Completed').length;
    const urgentTasks = this.data.tasks.filter((t) => t.priority === 'Urgent' && t.status !== 'Completed').length;
    const overdueTasks = this.data.tasks.filter((t) => t.dueDate < today && t.status !== 'Completed').length;

    const statusDistribution = {
      'To Do': 0,
      'In Progress': 0,
      'In Review': 0,
      Completed: 0,
    };

    const priorityDistribution = {
      Low: 0,
      Medium: 0,
      High: 0,
      Urgent: 0,
    };

    this.data.tasks.forEach((t) => {
      statusDistribution[t.status] = (statusDistribution[t.status] || 0) + 1;
      priorityDistribution[t.priority] = (priorityDistribution[t.priority] || 0) + 1;
    });

    return {
      totalProjects,
      activeProjects,
      totalTasks,
      completedTasks,
      urgentTasks,
      overdueTasks,
      statusDistribution,
      priorityDistribution,
    };
  }
}

export const dbStore = new Store();
