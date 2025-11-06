"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  startTime: number; // Unix timestamp in seconds
}

const CountdownTimer = ({ startTime }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({ text: '', isPast: false });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = startTime * 1000 - new Date().getTime();
      const isPast = difference <= 0;

      if (isPast) {
        const secondsAgo = Math.floor(Math.abs(difference) / 1000);
        const minutesAgo = Math.floor(secondsAgo / 60);
        
        if (minutesAgo > 0) {
          return { text: `-${minutesAgo}m ${secondsAgo % 60}s`, isPast: true };
        }
        return { text: `-${secondsAgo}s`, isPast: true };
      } else {
        const minutes = Math.floor(difference / 1000 / 60);
        const seconds = Math.floor((difference / 1000) % 60);
        return { text: `${minutes}m ${seconds.toString().padStart(2, '0')}s`, isPast: false };
      }
    };
    
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  return (
    <div
      className={cn(
        'font-mono text-xl md:text-2xl font-bold tabular-nums tracking-tighter',
        timeLeft.isPast ? 'text-destructive/80' : 'text-accent-foreground'
      )}
    >
      {timeLeft.text}
    </div>
  );
};

export default CountdownTimer;
