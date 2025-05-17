import { useCallback, useEffect, useRef, useState } from "react";

type TimerProps = {
  startTime: number;
  duration: number;
  onTick?: (remainingTime: number) => void;
  onEnd?: () => void;
};

type TimerReturnType = [number, () => void];

export function useTimer({
  startTime,
  duration,
  onTick,
  onEnd,
}: TimerProps): TimerReturnType {
  const [remainingTime, setRemainingTime] = useState(duration);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const savedCallbacks = useRef({ onTick, onEnd });

  useEffect(() => {
    savedCallbacks.current = { onTick, onEnd };
  }, [onTick, onEnd]);

  const clearTimer = useCallback(() => {
    intervalRef.current && clearInterval(intervalRef.current);
    timerRef.current && clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    const timeDiff = startTime - Date.now();

    const tick = () => {
      setRemainingTime((prev) => (prev > 0 ? prev - 1000 : 0));
      savedCallbacks.current.onTick?.(remainingTime);

      if (remainingTime <= 0) {
        clearTimer();
        savedCallbacks.current.onEnd?.();
      }
    };

    if (timeDiff > 0) {
      timerRef.current = setTimeout(() => {
        tick();
        intervalRef.current = setInterval(tick, 1000);
      }, timeDiff);
    } else {
      setRemainingTime((prev) => (prev += timeDiff));
      tick();
      intervalRef.current = setInterval(tick, 1000);
    }

    return clearTimer;
  }, [startTime, duration, clearTimer]);

  return [Math.round(remainingTime / 1000), clearTimer];
}
