import { useState, useEffect } from 'react';
import type { Todo, Priority } from '../types';

const STORAGE_KEY = 'todos';

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  function addTodo(title: string, priority: Priority, dueDate?: string) {
    const todo: Todo = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      priority,
      dueDate,
      createdAt: new Date().toISOString(),
    };
    setTodos(prev => [todo, ...prev]);
  }

  function toggleTodo(id: string) {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function deleteTodo(id: string) {
    setTodos(prev => prev.filter(t => t.id !== id));
  }

  function editTodo(id: string, title: string, priority: Priority, dueDate?: string) {
    setTodos(prev =>
      prev.map(t =>
        t.id === id ? { ...t, title: title.trim(), priority, dueDate } : t
      )
    );
  }

  function clearCompleted() {
    setTodos(prev => prev.filter(t => !t.completed));
  }

  return { todos, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted };
}
