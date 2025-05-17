import { Avatar, Timer } from "@/components/common";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useTimer } from "@/hooks/useTimer";
import { QuestionBox } from "./QuestionBox";
import { cn } from "@/lib/utils";
import { useCallback, useEffect } from "react";
import { GameSocketAction } from "@/redux/game/actionTypes";
import { useNavigate } from "react-router-dom";

export function AnswerPage() {
  const gameState = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const timerParams = gameState.timer
    ? {
        startTime: gameState.timer.startTime,
        duration: gameState.timer.duration,
      }
    : null;

  const [timerValue, clearTimer] = useTimer(
    timerParams || {
      startTime: 0,
      duration: 0,
    }
  );
  const remainingTime = gameState.timer ? timerValue : 0;

  useEffect(() => {
    console.log(remainingTime);
    if (
      ((gameState.answeredPlayers.length == gameState.players.length &&
        gameState.answeredPlayers.every((p) => p.answers == 2)) ||
        remainingTime === 1) &&
      gameState.player?.status == "VIP" &&
      gameState.currentQuestionForVotingIndex == 0
    ) {
      console.log("getQuestions");
      dispatchGetQuestion();
      clearTimer();
    }

    if (gameState.currentQuestionForVoting) {
      console.log("navigate");
      // TODO navigate
    }
  }, [gameState, remainingTime]);

  const dispatchGetQuestion = useCallback(() => {
    if (gameState.player?.status == "VIP") {
      dispatch<GameSocketAction>({
        type: "game/questionForVoting",
        payload: {
          questionId:
            gameState.availableQuestionsForVoting[
              gameState.currentQuestionForVotingIndex
            ],
          roundId: gameState.roundId,
          gameCode: gameState.gameCode,
        } as {
          questionId: number;
          roundId: string;
          gameCode: string;
        },
      });
    }
  }, []);

  return (
    <>
      {gameState.timer && (
        <Timer time={remainingTime} className="absolute top-13 left-30" />
      )}
      <QuestionBox />
      <div className="mt-10 mb-[-60px] flex justify-center items-baseline gap-4">
        {gameState.players.map((p, i) => (
          <Avatar
            key={i}
            style={{ animationDelay: `${i * 200}ms` }}
            className={cn(`animate-[2.5s_fly_linear_infinite]`, {
              "opacity-25": gameState.answeredPlayers.find(
                (ap) => ap.playerName == p.playerName && ap.answers == 2
              ),
            })}
            avatarURL={p.avatarURL}
            name={p.playerName}
            isVip={p.status == "VIP"}
          />
        ))}
      </div>
    </>
  );
}
