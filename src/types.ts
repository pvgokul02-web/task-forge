export type UserRole = 'Admin' | 'Project Manager' | 'Developer' | 'QA Tester';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  department: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export type TaskStatus = 'To Do' | 'In Progress' | 'In Review' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
}

export interface Task {
  id: string;
  key: string; // e.g. "TF-101"
  title: string;
  description: string;
  projectId: string;
  projectName?: string;
  projectKey?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  reporterId: string;
  reporterName?: string;
  dueDate: string;
  tags: string[];
  estimatedHours: number;
  loggedHours: number;
  subtasks: Subtask[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  key: string; // e.g. "TF"
  name: string;
  description: string;
  category: string;
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed';
  color: string;
  memberIds: string[];
  createdBy: string;
  createdAt: string;
  startDate: string;
  endDate: string;
  budgetHours?: number;
}

export interface Activity {
  id: string;
  taskId?: string;
  taskTitle?: string;
  projectId?: string;
  projectName?: string;
  userId: string;
  userName: string;
  userAvatar: string;
  actionType: 'created' | 'status_changed' | 'assigned' | 'updated' | 'commented' | 'deleted';
  description: string;
  timestamp: string;
  previousValue?: string;
  newValue?: string;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  urgentTasks: number;
  overdueTasks: number;
  statusDistribution: Record<TaskStatus, number>;
  priorityDistribution: Record<TaskPriority, number>;
}

export interface TaskFilterState {
  search: string;
  projectId: string;
  status: string;
  priority: string;
  assigneeId: string;
  tag: string;
}
