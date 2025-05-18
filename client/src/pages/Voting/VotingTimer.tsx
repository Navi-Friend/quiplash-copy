import { useTimer } from "@/hooks/useTimer";
import { Timer } from "@/components/common";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { memo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { GameSocketAction } from "@/redux/game/actionTypes";

interface VotingTimerProps {
  onTimeExpired: () => void;
}

export const VotingTimer = memo(function VotingTimer({
  onTimeExpired,
}: VotingTimerProps) {
  const gameState = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  const [timerValue, clearTimer] = useTimer({
    startTime: gameState.timer!.startTime + 5000,
    duration: gameState.timer?.duration || 10000,
  });

  useEffect(() => {
    if (timerValue <= 0) {
      onTimeExpired();
      clearTimer();
      if (gameState.player?.status == "VIP") {
        console.log("dispatch timer");
        dispatch<GameSocketAction>({
          type: "game/votingResults",
          payload: {
            roundId: gameState.roundId,
            gameCode: gameState.gameCode,
            answerId1: gameState.currentAnswersForVoting?.[0].answerId,
            answerId2: gameState.currentAnswersForVoting?.[1].answerId,
          } as {
            roundId: string;
            gameCode: string;
            answerId1: string;
            answerId2: string;
          },
        });
      }
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
});
