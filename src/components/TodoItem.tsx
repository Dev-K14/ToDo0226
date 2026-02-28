import { useState } from 'react';
import type { Todo, Priority } from '../types';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string, priority: Priority, dueDate?: string) => void;
}

const priorityConfig = {
  high: { label: '高', dot: 'bg-red-500', badge: 'bg-red-100 text-red-600' },
  medium: { label: '中', dot: 'bg-amber-400', badge: 'bg-amber-100 text-amber-700' },
  low: { label: '低', dot: 'bg-emerald-400', badge: 'bg-emerald-100 text-emerald-700' },
};

function isOverdue(dueDate?: string) {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate ?? '');

  function saveEdit() {
    if (!editTitle.trim()) return;
    onEdit(todo.id, editTitle, editPriority, editDueDate || undefined);
    setEditing(false);
  }

  function cancelEdit() {
    setEditTitle(todo.title);
    setEditPriority(todo.priority);
    setEditDueDate(todo.dueDate ?? '');
    setEditing(false);
  }

  const cfg = priorityConfig[todo.priority];
  const overdue = isOverdue(todo.dueDate) && !todo.completed;

  if (editing) {
    return (
      <li className="bg-white rounded-xl shadow-sm border border-indigo-100 p-4">
        <input
          autoFocus
          type="text"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') saveEdit();
            if (e.key === 'Escape') cancelEdit();
          }}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <div className="flex gap-2 items-center mb-3">
          {(['high', 'medium', 'low'] as Priority[]).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setEditPriority(p)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                editPriority === p
                  ? p === 'high'
                    ? 'bg-red-500 text-white'
                    : p === 'medium'
                    ? 'bg-amber-400 text-white'
                    : 'bg-emerald-400 text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {priorityConfig[p].label}
            </button>
          ))}
          <input
            type="date"
            value={editDueDate}
            onChange={e => setEditDueDate(e.target.value)}
            className="border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={saveEdit}
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            保存
          </button>
          <button
            onClick={cancelEdit}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            キャンセル
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className={`group bg-white rounded-xl shadow-sm border transition-all ${
      todo.completed ? 'opacity-60 border-gray-100' : 'border-gray-100 hover:border-indigo-200 hover:shadow-md'
    }`}>
      <div className="flex items-center gap-3 p-4">
        <button
          onClick={() => onToggle(todo.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
            todo.completed
              ? 'border-indigo-500 bg-indigo-500'
              : 'border-gray-300 hover:border-indigo-400'
          }`}
        >
          {todo.completed && (
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-gray-800 font-medium truncate ${todo.completed ? 'line-through text-gray-400' : ''}`}>
            {todo.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}優先
            </span>
            {todo.dueDate && (
              <span className={`text-xs font-medium ${overdue ? 'text-red-500' : 'text-gray-400'}`}>
                {overdue ? '⚠ ' : ''}期日: {formatDate(todo.dueDate)}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setEditing(true)}
            className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            title="編集"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="削除"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
}
