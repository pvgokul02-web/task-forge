import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { dbStore } from './src/server/store.js';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper for lazy Gemini AI instance
  const getAiInstance = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
  };

  // --- API ROUTES ---

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Database Reset Endpoint
  app.post('/api/reset', (req, res) => {
    const seedData = dbStore.resetToSeed();
    res.json({ message: 'Database reset to seed data', data: seedData });
  });

  // --- AUTH & USERS ---
  app.get('/api/users', (req, res) => {
    res.json(dbStore.getUsers());
  });

  app.post('/api/auth/login', (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const users = dbStore.getUsers();
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Auto register default new developer user
      user = dbStore.createUser({
        name: email.split('@')[0].replace('.', ' '),
        email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: 'Developer',
        department: 'Engineering',
        status: 'Active',
      });
    }

    res.json({ user });
  });

  app.post('/api/users', (req, res) => {
    const { name, email, role, department, avatar } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const newUser = dbStore.createUser({
      name,
      email,
      role: role || 'Developer',
      department: department || 'Engineering',
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      status: 'Active',
    });
    res.status(201).json(newUser);
  });

  app.put('/api/users/:id', (req, res) => {
    const updated = dbStore.updateUser(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json(updated);
  });

  app.delete('/api/users/:id', (req, res) => {
    const success = dbStore.deleteUser(req.params.id);
    if (!success) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true });
  });

  // --- PROJECTS ---
  app.get('/api/projects', (req, res) => {
    res.json(dbStore.getProjects());
  });

  app.get('/api/projects/:id', (req, res) => {
    const project = dbStore.getProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  });

  app.post('/api/projects', (req, res) => {
    const { name, key, description, category, status, color, memberIds, startDate, endDate, budgetHours, actorName, actorId, actorAvatar } = req.body;
    if (!name || !key) {
      return res.status(400).json({ error: 'Project name and key are required' });
    }

    const newProj = dbStore.createProject(
      {
        name,
        key: key.toUpperCase(),
        description: description || '',
        category: category || 'Software Development',
        status: status || 'Planning',
        color: color || '#3b82f6',
        memberIds: memberIds || [],
        createdBy: actorName || 'System Admin',
        startDate: startDate || new Date().toISOString().split('T')[0],
        endDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        budgetHours: Number(budgetHours) || 100,
      },
      actorName || 'System Admin',
      actorId || 'u-1',
      actorAvatar || ''
    );

    res.status(201).json(newProj);
  });

  app.put('/api/projects/:id', (req, res) => {
    const updated = dbStore.updateProject(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Project not found' });
    res.json(updated);
  });

  app.delete('/api/projects/:id', (req, res) => {
    const success = dbStore.deleteProject(req.params.id);
    if (!success) return res.status(404).json({ error: 'Project not found' });
    res.json({ success: true });
  });

  // --- TASKS ---
  app.get('/api/tasks', (req, res) => {
    const { projectId, assigneeId, status, search } = req.query;
    const tasks = dbStore.getTasks({
      projectId: projectId as string,
      assigneeId: assigneeId as string,
      status: status as string,
      search: search as string,
    });
    res.json(tasks);
  });

  app.post('/api/tasks', (req, res) => {
    const { title, projectId, description, priority, assigneeId, dueDate, tags, estimatedHours, actorName, actorId, actorAvatar, subtasks } = req.body;
    if (!title || !projectId) {
      return res.status(400).json({ error: 'Title and projectId are required' });
    }

    let assigneeName = '';
    let assigneeAvatar = '';
    if (assigneeId) {
      const user = dbStore.getUserById(assigneeId);
      if (user) {
        assigneeName = user.name;
        assigneeAvatar = user.avatar;
      }
    }

    const newTask = dbStore.createTask(
      {
        title,
        description: description || '',
        projectId,
        status: 'To Do',
        priority: priority || 'Medium',
        assigneeId: assigneeId || '',
        assigneeName,
        assigneeAvatar,
        reporterId: actorId || 'u-1',
        reporterName: actorName || 'Alex Vance',
        dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tags: tags || ['General'],
        estimatedHours: Number(estimatedHours) || 8,
        loggedHours: 0,
        subtasks: subtasks || [],
        comments: [],
      },
      actorName || 'System Admin',
      actorId || 'u-1',
      actorAvatar || ''
    );

    res.status(201).json(newTask);
  });

  app.put('/api/tasks/:id', (req, res) => {
    const { actorName, actorId, actorAvatar, ...updates } = req.body;

    if (updates.assigneeId) {
      const user = dbStore.getUserById(updates.assigneeId);
      if (user) {
        updates.assigneeName = user.name;
        updates.assigneeAvatar = user.avatar;
      }
    }

    const updated = dbStore.updateTask(req.params.id, updates, actorName || 'User', actorId || 'u-1', actorAvatar || '');
    if (!updated) return res.status(404).json({ error: 'Task not found' });
    res.json(updated);
  });

  app.post('/api/tasks/:id/comment', (req, res) => {
    const { content, userId, userName, userAvatar } = req.body;
    if (!content || !userId) {
      return res.status(400).json({ error: 'Content and userId are required' });
    }

    const updatedTask = dbStore.addComment(req.params.id, content, userId, userName || 'User', userAvatar || '');
    if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
    res.json(updatedTask);
  });

  app.delete('/api/tasks/:id', (req, res) => {
    const { actorName, actorId, actorAvatar } = req.body;
    const success = dbStore.deleteTask(req.params.id, actorName || 'User', actorId || 'u-1', actorAvatar || '');
    if (!success) return res.status(404).json({ error: 'Task not found' });
    res.json({ success: true });
  });

  // --- ACTIVITIES ---
  app.get('/api/activity', (req, res) => {
    res.json(dbStore.getActivities());
  });

  // --- STATS ---
  app.get('/api/stats', (req, res) => {
    res.json(dbStore.getStats());
  });

  // --- AI GEMINI ASSISTANT ---
  app.post('/api/ai/subtasks', async (req, res) => {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required for AI subtask generation' });
    }

    try {
      const ai = getAiInstance();
      if (!ai) {
        // Fallback default response if no key set
        return res.json({
          subtasks: [
            { id: 'st-1', title: 'Define requirement specs & scope', completed: false },
            { id: 'st-2', title: 'Draft component layout and design', completed: false },
            { id: 'st-3', title: 'Implement core functionality & APIs', completed: false },
            { id: 'st-4', title: 'Perform unit tests and peer code review', completed: false },
          ],
          estimatedHours: 12,
          suggestedPriority: 'Medium',
        });
      }

      const prompt = `You are a Senior Project Manager at a software development agency. Break down this task into 3 to 5 realistic, actionable subtasks and suggest estimated hours and priority (Low, Medium, High, Urgent).
Task Title: ${title}
Task Description: ${description || 'N/A'}

Respond strictly in valid JSON format matching this schema:
{
  "subtasks": [
    { "id": "st-1", "title": "Subtask title...", "completed": false }
  ],
  "estimatedHours": 8,
  "suggestedPriority": "High"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        return res.json(parsed);
      }
      throw new Error('Empty AI response');
    } catch (err: any) {
      console.error('Gemini AI Subtask Generation error:', err);
      return res.json({
        subtasks: [
          { id: 'st-1', title: 'Define task requirements', completed: false },
          { id: 'st-2', title: 'Implement feature code', completed: false },
          { id: 'st-3', title: 'Test and verify results', completed: false },
        ],
        estimatedHours: 8,
        suggestedPriority: 'Medium',
      });
    }
  });

  app.post('/api/ai/chat', async (req, res) => {
    const { message, projectContext } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    try {
      const ai = getAiInstance();
      if (!ai) {
        return res.json({
          reply: 'TaskForge AI Assistant is active! You can ask questions about task prioritization, project planning, and sprint bottlenecks.',
        });
      }

      const prompt = `You are "TaskForge AI", an intelligent software project management assistant integrated into the TaskForge application.
Project Context: ${projectContext ? JSON.stringify(projectContext) : 'TaskForge Workspace'}
User Question: "${message}"

Give a concise, helpful, professional response focusing on software engineering best practices, task management, risk mitigation, and team productivity.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      res.json({ reply: response.text || 'I analyzed your request. Let me know if you need specific task breakdowns.' });
    } catch (err) {
      console.error('Gemini AI Chat error:', err);
      res.json({ reply: 'AI Assistant temporarily unavailable. You can still use manual task management features.' });
    }
  });

  // --- VITE / SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TaskForge server running on http://localhost:${PORT}`);
  });
}

startServer();
