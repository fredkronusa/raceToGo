"use client";

import { cn } from "@/lib/utils";
import { useCountdown } from "@/hooks/useCountdown";

interface CountdownTimerProps {
  startTime: number; // Unix timestamp in seconds
}

const CountdownTimer = ({ startTime }: CountdownTimerProps) => {
  const { text, isPast } = useCountdown(startTime);

  return (
    <div
      className={cn(
        "font-mono text-xl md:text-2xl font-bold tabular-nums text-right ",
        isPast ? "text-destructive/80" : "text-accent-foreground"
      )}
    >
      {text}
    </div>
  );
};
export default CountdownTimer;
