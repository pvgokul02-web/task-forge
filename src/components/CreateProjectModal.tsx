import React, { useState } from 'react';
import { User } from '../types';
import { X, FolderKanban, Plus } from 'lucide-react';

interface CreateProjectModalProps {
  users: User[];
  onClose: () => void;
  onCreateProject: (projectData: any) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  users,
  onClose,
  onCreateProject,
}) => {
  const [name, setName] = useState('');
  const [key, setKey] = useState('TF');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Software Development');
  const [color, setColor] = useState('#3b82f6');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(users.map((u) => u.id));
  const [budgetHours, setBudgetHours] = useState(120);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !key) return;

    onCreateProject({
      name,
      key: key.toUpperCase(),
      description,
      category,
      color,
      memberIds: selectedMemberIds,
      budgetHours,
    });
    onClose();
  };

  const toggleMember = (id: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-8">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-blue-600" />
            Create Project
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Enterprise Payment Gateway V3"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.length >= 2 && key === 'TF') {
                  const words = e.target.value.split(' ').filter(Boolean);
                  const generatedKey = words.map((w) => w[0]).join('').substring(0, 4).toUpperCase();
                  if (generatedKey) setKey(generatedKey);
                }
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Project Key Prefix (e.g. PAY) *
              </label>
              <input
                type="text"
                required
                maxLength={5}
                value={key}
                onChange={(e) => setKey(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs uppercase font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
              >
                <option value="Software Development">Software Development</option>
                <option value="Mobile Backend">Mobile Backend</option>
                <option value="DevOps & Security">DevOps & Security</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Data Engineering">Data Engineering</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Detailed project scope, goals, and release objectives..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Assign Team Members
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {users.map((u) => (
                <label
                  key={u.id}
                  className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-xs"
                >
                  <input
                    type="checkbox"
                    checked={selectedMemberIds.includes(u.id)}
                    onChange={() => toggleMember(u.id)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                  />
                  <span className="truncate text-slate-800 dark:text-slate-200 font-medium">
                    {u.name} ({u.role})
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
