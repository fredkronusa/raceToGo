import { useEffect, useState } from "react";

export const useCountdown = (startTime: number) => {
  const format = () => {
    const secondsRemaining = Math.floor(startTime - Date.now() / 1000); // seconds difference
    const isPast = secondsRemaining <= 0;
    const positiveSecondsRemaining = Math.abs(secondsRemaining);
    const minutes = Math.floor(positiveSecondsRemaining / 60);
    const seconds = positiveSecondsRemaining - minutes * 60;

    const text = isPast
      ? `-${seconds}s`
      : `${minutes > 0 ? `${minutes}m ` : ""}${seconds.toString().padStart(2, "0")}s`;

    return { text, isPast };
  };

  const [timeLeft, setTimeLeft] = useState(format);

  useEffect(() => {
    const tick = () => setTimeLeft(format());
    tick(); // update immediately
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  return timeLeft;
};
