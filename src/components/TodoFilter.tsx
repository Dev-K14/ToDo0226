import type { Filter } from '../types';

interface Props {
  filter: Filter;
  onFilter: (f: Filter) => void;
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}

const tabs: { value: Filter; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'active', label: '未完了' },
  { value: 'completed', label: '完了' },
];

export function TodoFilter({ filter, onFilter, activeCount, completedCount, onClearCompleted }: Props) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => onFilter(tab.value)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              filter === tab.value
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span>{activeCount}件未完了</span>
        {completedCount > 0 && (
          <button
            onClick={onClearCompleted}
            className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
          >
            完了を削除
          </button>
        )}
      </div>
    </div>
  );
}
