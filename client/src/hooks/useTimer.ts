import { useEffect, useRef, useState } from "react";

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
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  function clearFn() {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  useEffect(() => {
    const timeDiff = startTime - Date.now();

    function startTimer(timeDiff?: number) {
      let remain = duration;
      if (timeDiff && timeDiff <= 0) {
        remain += timeDiff;
      }
      setRemainingTime(remain > 0 ? remain : 0);

      const updateTimer = () => {
        remain -= 1000;
        setRemainingTime(remain > 0 ? remain : 0);
        if (onTick) {
          onTick(remain > 0 ? remain : 0);
        }
        if (remain <= 0) {
          if (onEnd) onEnd();
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      };

      intervalRef.current = setInterval(updateTimer, 1000);
    }

    if (timeDiff > 0) {
      timerRef.current = setTimeout(startTimer, timeDiff);
      console.log("start timer");
    } else {
      startTimer(timeDiff);
    }

    return clearFn;
  }, [startTime, duration]);

  return [Math.round(remainingTime / 1000), clearFn];
}
