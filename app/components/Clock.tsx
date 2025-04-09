'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

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

  const handleOpenPriceLink = () => {
    window.open('https://1bang.kr/pages/tp', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full max-w-full px-4 md:max-w-2xl mx-auto mb-4">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 shadow-xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-5xl font-bold text-white mb-1">{time ? time.toLocaleTimeString('ko-KR') : ''}</h2>
              <p className="text-indigo-200">{time ? time.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              }) : ''}</p>
            </div>
            <div className="flex items-center h-full">
              <Button
                onClick={handleOpenPriceLink}
                variant="secondary"
                className="bg-purple-600 hover:bg-purple-700 text-white"
                aria-label="시세 보기"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                시세
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 