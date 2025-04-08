'use client';

import { useState, useEffect } from 'react';
import AddTodoModal from './AddTodoModal';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  department: string; // 백화점
  category: string;   // 구분
  month: string;      // 월
  amount: number;     // 금액
  card: string;       // 카드
  date: string;       // 날짜
  time: string;       // 시간
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

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

  const handleAddTodo = (newTodo: Omit<Todo, 'id' | 'completed'>) => {
    setTodos([
      ...todos,
      {
        ...newTodo,
        id: Date.now(),
        completed: false,
      }
    ]);
    setIsModalOpen(false);
  };

  const handleClearAllTodos = () => {
    if (window.confirm('정말 모든 항목을 삭제하시겠습니까?')) {
      setTodos([]);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // 금액 합계 계산
  const totalAmount = todos.reduce((sum, todo) => sum + todo.amount, 0);
  const filteredTotalAmount = filteredTodos.reduce((sum, todo) => sum + todo.amount, 0);

  // 월별 합계 계산
  const getMonthlyTotals = (todoList: Todo[]) => {
    const monthlyTotals: Record<string, number> = {};
    
    todoList.forEach(todo => {
      if (!monthlyTotals[todo.month]) {
        monthlyTotals[todo.month] = 0;
      }
      monthlyTotals[todo.month] += todo.amount;
    });
    
    // 월 순서대로 정렬
    return Object.entries(monthlyTotals)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([month, amount]) => ({ month, amount }));
  };
  
  const monthlyTotals = getMonthlyTotals(filteredTodos);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md transition-colors ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-white/10 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300'}`}
          >
            전체
          </button>
          <button 
            onClick={() => setFilter('active')}
            className={`px-3 py-1 rounded-md transition-colors ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-white/10 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300'}`}
          >
            미수신
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-md transition-colors ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-white/10 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300'}`}
          >
            수신
          </button>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-sm transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="할 일 추가하기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          추가하기
        </button>
      </div>
      
      {/* 금액 합계 표시 */}
      <div className="mb-4 p-4 bg-white/10 dark:bg-gray-800/30 backdrop-blur-md rounded-xl border border-white/20 dark:border-gray-700/30 shadow-sm">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300"> 합계:</span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              {filteredTotalAmount.toLocaleString()}원
            </span>
          </div>
          {filter !== 'all' && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">구매 총액:</span>
              <span className="font-medium text-gray-600 dark:text-gray-400">
                {totalAmount.toLocaleString()}원
              </span>
            </div>
          )}
          
          {/* 월별 합계 표시 */}
          {monthlyTotals.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">월별 합계:</h3>
              <div className="grid grid-cols-2 gap-2">
                {monthlyTotals.map(({ month, amount }) => (
                  <div key={month} className="flex justify-between items-center bg-white/20 dark:bg-gray-700/20 rounded-lg p-2">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{month}월</span>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{amount.toLocaleString()}원</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {filteredTodos.length === 0 ? (
        <div className="text-center py-8 px-4 bg-white/10 dark:bg-gray-800/30 backdrop-blur-md rounded-xl border border-white/20 dark:border-gray-700/30">
          <p className="text-gray-500 dark:text-gray-400">표시할 항목이 없습니다.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filteredTodos.map(todo => (
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
              <div className="flex-1">
                <span 
                  className={`block text-lg transition-all ${
                    todo.completed 
                      ? 'line-through text-gray-400 dark:text-gray-500' 
                      : 'text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {todo.text}
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">{todo.department}</span>
                  <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full">{todo.category}</span>
                  <span className="text-xs px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 rounded-full">{todo.month}월</span>
                  <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">{todo.amount.toLocaleString()}원</span>
                  <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full">{todo.card}</span>
                  <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-full">{todo.date}</span>
                  <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full">{todo.time}</span>
                </div>
              </div>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                onKeyDown={(e) => handleKeyDown(e, todo.id)}
                className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
                tabIndex={0}
                aria-label={`${todo.text} 삭제하기`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
      
      {isModalOpen && <AddTodoModal onClose={() => setIsModalOpen(false)} onAddTodo={handleAddTodo} />}
      
      {/* 전체 삭제 버튼 */}
      {todos.length > 0 && (
        <div className="mt-8 flex justify-center w-full">
          <button
            onClick={handleClearAllTodos}
            className="w-full max-w-md px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-xl shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            교환 완료
          </button>
        </div>
      )}
    </div>
  );
} 