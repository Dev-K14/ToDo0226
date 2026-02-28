import { useState } from 'react';
import type { Priority } from '../types';

interface Props {
  onAdd: (title: string, priority: Priority, dueDate?: string) => void;
}

const priorityOptions: { value: Priority; label: string }[] = [
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' },
];

export function TodoInput({ onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title, priority, dueDate || undefined);
    setTitle('');
    setDueDate('');
    setPriority('medium');
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex gap-3 mb-3">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="新しいタスクを入力..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white font-semibold px-6 py-3 rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          追加
        </button>
      </div>
      <div className="flex gap-3 items-center">
        <div className="flex gap-2">
          {priorityOptions.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setPriority(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                priority === opt.value
                  ? opt.value === 'high'
                    ? 'bg-red-500 text-white'
                    : opt.value === 'medium'
                    ? 'bg-amber-400 text-white'
                    : 'bg-emerald-400 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {opt.label}優先
            </button>
          ))}
        </div>
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
      </div>
    </form>
  );
}
