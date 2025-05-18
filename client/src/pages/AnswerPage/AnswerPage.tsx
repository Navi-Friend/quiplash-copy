import { Avatar, Timer } from "@/components/common";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useTimer } from "@/hooks/useTimer";
import { QuestionBox } from "./QuestionBox";
import { cn } from "@/lib/utils";
import { useCallback, useEffect } from "react";
import { GameSocketAction } from "@/redux/game/actionTypes";
import { useNavigate } from "react-router-dom";
import { routes } from "@/lib/routes";

export function AnswerPage() {
  const gameState = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [timerValue, clearTimer] = useTimer({
    startTime: gameState.timer?.startTime || Date.now() + 1000,
    duration: gameState.timer?.duration || 10000,
  });

  useEffect(() => {
    if (
      (gameState.answeredPlayers.length == gameState.players.length &&
        gameState.answeredPlayers.every((p) => p.answers == 2)) ||
      timerValue <= 0
    ) {
      clearTimer();
      if (
        gameState.player?.status == "VIP" &&
        gameState.currentQuestionForVotingIndex == 0
      ) {
        dispatchGetQuestion();
      }
    }

    if (gameState.currentAnswersForVoting) {
      console.log("navigate");
      navigate(routes.vote)
    }
  }, [gameState, timerValue]);

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
        <Timer time={timerValue} className="absolute top-13 left-30" />
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
