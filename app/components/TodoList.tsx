'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false
      }
    ]);
    setNewTodo('');
  };

  const handleToggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDeleteTodo(id);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="할 일을 입력하세요"
          className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
          aria-label="새 할 일 입력"
        />
        <button
          type="submit"
          className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-sm transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="할 일 추가하기"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </form>
      
      {todos.length === 0 ? (
        <div className="text-center py-8 px-4 bg-white/10 dark:bg-gray-800/30 backdrop-blur-md rounded-xl border border-white/20 dark:border-gray-700/30">
          <p className="text-gray-500 dark:text-gray-400">할 일이 없습니다. 새로운 할 일을 추가해보세요!</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {todos.map(todo => (
            <li
              key={todo.id}
              className="group flex items-center gap-3 p-4 bg-white/10 dark:bg-gray-800/30 backdrop-blur-md rounded-xl border border-white/20 dark:border-gray-700/30 shadow-sm transition-all hover:shadow-md"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo.id)}
                className="w-5 h-5 rounded-md border-gray-300 text-blue-500 focus:ring-blue-500 transition-colors"
                aria-label={`${todo.text} 완료로 표시`}
              />
              <span 
                className={`flex-1 transition-all ${
                  todo.completed 
                    ? 'line-through text-gray-400 dark:text-gray-500' 
                    : 'text-gray-800 dark:text-gray-200'
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                onKeyDown={(e) => handleKeyDown(e, todo.id)}
                className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
                tabIndex={0}
                aria-label={`${todo.text} 삭제하기`}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 