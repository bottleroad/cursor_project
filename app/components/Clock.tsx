'use client';

import { useState, useEffect } from 'react';

export default function Clock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // 클라이언트에서만 초기 시간 설정
    setTime(new Date());
    
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto mb-8 backdrop-blur-md bg-white/10 dark:bg-gray-800/30 rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      <div className="px-6 py-8 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/50 to-purple-600/50 opacity-60 z-0"></div>
        <div className="relative z-10">
          <div className="text-4xl font-bold text-white mb-2 tracking-tight">
            {time ? time.toLocaleTimeString('ko-KR') : ''}
          </div>
          <div className="text-sm text-white/80 font-medium">
            {time ? time.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            }) : ''}
          </div>
        </div>
      </div>
    </div>
  );
} 