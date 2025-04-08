import Clock from './components/Clock';
import TodoList from './components/TodoList';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight">상품권 관리</h1>
        <Clock />
        <TodoList />
      </div>
    </div>
  );
}
