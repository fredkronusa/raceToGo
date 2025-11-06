import { useMemo } from "react";

export const useCountdown = (startTime: number, now: number) => {
  return useMemo(() => {
    const msRemaining = startTime * 1000 - now;
    const isPast = msRemaining < 0;

    const totalSeconds = Math.floor(Math.abs(msRemaining) / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedSeconds = seconds.toString().padStart(2, "0");

    const text = isPast
      ? minutes > 0
        ? `-${minutes}m ${formattedSeconds}s`
        : `-${formattedSeconds}s`
      : minutes === 0
      ? `${formattedSeconds}s`
      : minutes < 5
      ? `${minutes}m ${formattedSeconds}s`
      : `${minutes}m`;

    return { text, isPast };
  }, [startTime, now]);
};
