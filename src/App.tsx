import { useState } from 'react';
import { useTodos } from './hooks/useTodos';
import { TodoInput } from './components/TodoInput';
import { TodoFilter } from './components/TodoFilter';
import { TodoItem } from './components/TodoItem';
import type { Filter } from './types';

export default function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted } = useTodos();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-1">
            ✅ ToDo
          </h1>
          <p className="text-gray-400 text-sm">タスクを管理しましょう</p>
        </div>

        <TodoInput onAdd={addTodo} />

        <TodoFilter
          filter={filter}
          onFilter={setFilter}
          activeCount={activeCount}
          completedCount={completedCount}
          onClearCompleted={clearCompleted}
        />

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">
              {filter === 'completed' ? '🎉' : '📝'}
            </div>
            <p className="text-lg font-medium">
              {filter === 'completed'
                ? '完了したタスクはありません'
                : filter === 'active'
                ? '未完了のタスクはありません'
                : 'タスクを追加してみましょう！'}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {filtered.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
