'use client';

import { useState, useEffect } from 'react';
import AddTodoModal from './AddTodoModal';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  department: string; // 백화점
  category: string;   // 지류/모바일
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
    if (window.confirm('이 항목을 삭제하시겠습니까?')) {
      setTodos(todos.filter(todo => todo.id !== id));
    }
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

  // 백화점별 합계 계산
  const departmentTotals = todos.reduce((acc, todo) => {
    const dept = todo.department;
    acc[dept] = (acc[dept] || 0) + todo.amount;
    return acc;
  }, {} as { [key: string]: number });

  // 월별 합계 계산
  const monthlyTotals = todos.reduce((acc, todo) => {
    const month = todo.month;
    acc[month] = (acc[month] || 0) + todo.amount;
    return acc;
  }, {} as { [key: string]: number });

  // 합계 섹션 렌더링
  const renderTotals = () => {
    return (
      <div className="mt-6 space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">백화점별 합계</h3>
          <div className="space-y-2">
            {Object.entries(departmentTotals).map(([dept, total]) => (
              <div key={dept} className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-300">{dept}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {total.toLocaleString()}원
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">월별 합계</h3>
          <div className="space-y-2">
            {Object.entries(monthlyTotals)
              .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
              .map(([month, total]) => (
                <div key={month} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-300">{month}월</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {total.toLocaleString()}원
                  </span>
                </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">카드별 합계</h3>
          <div className="space-y-2">
            {Object.entries(todos.reduce((acc, todo) => {
              const card = todo.card;
              acc[card] = (acc[card] || 0) + todo.amount;
              return acc;
            }, {} as { [key: string]: number }))
              .map(([card, total]) => (
                <div key={card} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-300">{card}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {total.toLocaleString()}원
                  </span>
                </div>
            ))}
          </div>
        </div>
        
      </div>
    );
  };

  return (
    <div className="container mx-auto px-2">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-1 md:space-x-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={`${
              filter === 'all'
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border-zinc-700'
            } transition-colors text-sm md:text-base px-2 md:px-4`}
          >
            전체
          </Button>
          <Button 
            variant={filter === 'active' ? 'default' : 'outline'}
            onClick={() => setFilter('active')}
            className={`${
              filter === 'active'
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border-zinc-700'
            } transition-colors text-sm md:text-base px-2 md:px-4`}
          >
            미수신
          </Button>
          <Button 
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
            className={`${
              filter === 'completed'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border-zinc-700'
            } transition-colors text-sm md:text-base px-2 md:px-4`}
          >
            수신
          </Button>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center gap-1 px-2 py-1.5 md:px-4 md:py-2 text-sm md:text-base"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          추가하기
        </Button>
      </div>
      
      {/* 금액 합계 표시 */}
      <Card className="mb-4 bg-zinc-900/50 border-zinc-800">
        <div className="p-3 md:p-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 text-sm md:text-base">합계:</span>
              <span className="text-base md:text-lg font-bold text-emerald-400">
                {filteredTotalAmount.toLocaleString()}원
              </span>
            </div>
            {filter !== 'all' && (
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 text-sm md:text-base">구매 총액:</span>
                <span className="text-sm md:text-base font-medium text-zinc-400">
                  {totalAmount.toLocaleString()}원
                </span>
              </div>
            )}
            
            {/* 백화점별 합계와 월별 합계는 전체 목록에서만 표시 */}
            {filter === 'all' && renderTotals()}
          </div>
        </div>
      </Card>
      
      {filteredTodos.length === 0 ? (
        <Card className="text-center py-8 px-4 bg-zinc-900/50 border-zinc-800">
          <p className="text-zinc-400">표시할 항목이 없습니다.</p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {filteredTodos.map(todo => (
            <Card
              key={todo.id}
              className="group relative flex items-center p-4 bg-zinc-900/50 border-zinc-800"
            >
              <div className="flex items-start flex-1 min-w-0 gap-3">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => handleToggleTodo(todo.id)}
                  aria-label={`${todo.text} 완료로 표시`}
                  className="mt-1.5 border-2 border-indigo-500 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                />
                <div className="flex-1 min-w-0 pr-12">
                  <span 
                    className={`block text-lg truncate ${
                      todo.completed 
                        ? 'line-through text-muted-foreground' 
                        : 'text-zinc-100'
                    }`}
                  >
                    {todo.text}
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="outline" className="bg-zinc-800 text-zinc-100 border-zinc-700">{todo.department}</Badge>
                    <Badge variant="outline" className="bg-red-900/50 text-red-100 border-red-800">
                      {todo.category === "지류" || todo.category === "모바일" ? todo.category : "지류"}
                    </Badge>
                    <Badge variant="outline" className="bg-zinc-800 text-zinc-100 border-zinc-700">{todo.month}월</Badge>
                    <Badge variant="outline" className="bg-emerald-900/50 text-emerald-100 border-emerald-800">{todo.amount.toLocaleString()}원</Badge>
                    <Badge variant="outline" className="bg-zinc-800 text-zinc-100 border-zinc-700">{todo.card}</Badge>
                    <Badge variant="outline" className="bg-zinc-800 text-zinc-100 border-zinc-700">{todo.date}</Badge>
                    <Badge variant="outline" className="bg-zinc-800 text-zinc-100 border-zinc-700">{todo.time}</Badge>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteTodo(todo.id)}
                onKeyDown={(e) => handleKeyDown(e, todo.id)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-red-400 hover:bg-red-900/20 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900 rounded-lg transition-all"
                aria-label={`${todo.text} 삭제하기`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </Button>
            </Card>
          ))}
        </ul>
      )}
      
      {isModalOpen && <AddTodoModal onClose={() => setIsModalOpen(false)} onAddTodo={handleAddTodo} />}
      
      {/* 전체 삭제 버튼 */}
      {todos.length > 0 && (
        <div className="mt-8">
          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center justify-center gap-2 px-4 py-6 rounded-xl"
            onClick={handleClearAllTodos}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span className="text-base">전체 항목 삭제</span>
          </Button>
        </div>
      )}
    </div>
  );
} 