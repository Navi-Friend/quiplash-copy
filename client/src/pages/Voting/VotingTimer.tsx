import { useTimer } from "@/hooks/useTimer";
import { Timer } from "@/components/common";
import { useAppSelector } from "@/hooks/redux";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface VotingTimerProps {
  onTimeExpired: () => void;
}

export function VotingTimer({ onTimeExpired }: VotingTimerProps) {
  const gameState = useAppSelector((state) => state.game);
  const [timerValue, clearTimer] = useTimer({
    startTime: gameState.timer!.startTime + 5000,
    duration: gameState.timer?.duration || 10000,
  });

  useEffect(() => {
    if (timerValue <= 0) {
      onTimeExpired();
      clearTimer();
    }
  }, [timerValue, onTimeExpired, clearTimer]);

  return (
    <Timer
      time={timerValue}
      className={cn("absolute top-13 left-20", {
        "text-red-500": timerValue <= 0,
      })}
    />
  );
}
