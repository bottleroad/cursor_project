'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function Clock() {
  const [time, setTime] = useState<Date | null>(null);
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    // 클라이언트에서만 초기 시간 설정
    setTime(new Date());
    setDate(new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    }));
    
    const timer = setInterval(() => {
      setTime(new Date());
      setDate(new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handlePriceClick = () => {
    window.open('https://1bang.kr/pages/tp', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="container mx-auto px-2">
      <Card className="bg-zinc-900/50 border-zinc-800 mb-4">
        <div className="p-3 md:p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                {time ? time.toLocaleTimeString('ko-KR') : ''}
              </h1>
              <p className="text-sm md:text-base text-zinc-400">
                {date}
              </p>
            </div>
            <div className="flex items-center h-full">
              <Button
                variant="secondary"
                onClick={handlePriceClick}
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm md:text-base px-2 py-1.5 md:px-4 md:py-2"
                aria-label="시세 확인하기"
              >
                <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 