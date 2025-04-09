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
    <Card className="w-full max-w-md mx-auto mb-8 bg-gradient-to-br from-blue-500/50 to-purple-600/50">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
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
      </CardContent>
    </Card>
  );
} 