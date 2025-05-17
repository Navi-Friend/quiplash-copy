import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useEffect, useState } from "react";
import { Question } from "./Question";
import { AnswerOption } from "./AnswerOption";
import { Button } from "@/components/ui/button";
import { GameSocketAction } from "@/redux/game/actionTypes";
import { motion } from "framer-motion";
import { OrButton } from "./OrButton";
import { cn } from "@/lib/utils";
import { useTimer } from "@/hooks/useTimer";
import { Timer } from "@/components/common";

export enum Stages {
  SHOW_QUESTION,
  VOTING,
  RESULTS,
}

export function VotingPage() {
  const gameState = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();

  const [stage, setStage] = useState<Stages>(Stages.SHOW_QUESTION);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const [timerValue, clearTimer] = useTimer({
    startTime: gameState.timer?.startTime || Date.now() + 1000,
    duration: gameState.timer?.duration || 10000,
  });

  useEffect(() => {
    if (stage === Stages.SHOW_QUESTION) {
      const timer = setTimeout(() => {
        setStage(Stages.VOTING);
      }, 3000);

      if (timerValue <= 0) {
        // dispatch()
      }
      return () => clearTimeout(timer);
    }
  }, [stage, gameState, timerValue]);

  const showAnswers = stage !== Stages.SHOW_QUESTION;
  const currentQuestion = gameState.currentQuestionForVoting;
  const currentAnswers = gameState.currentAnswersForVoting;

  const handleSubmit = () => {
    if (selectedAnswer !== null && currentAnswers && !hasVoted) {
      dispatch<GameSocketAction>({
        type: "game/voteForAnswer",
        payload: {
          answerId: currentAnswers[selectedAnswer].answerId,
          gameCode: gameState.gameCode,
          roundId: gameState.roundId,
          playerName: gameState.player?.playerName,
        } as {
          answerId: string;
          gameCode: string;
          roundId: string;
          playerName: string;
        },
      });
      setHasVoted(true);
      // setStage(Stages.RESULTS);
    }
  };

  const handleSelect = (index: number) => {
    if (!hasVoted) {
      setSelectedAnswer(index);
    }
  };

  return (
    <div className="w-full min-h-[95vh] flex items-center justify-center flex-col relative">
      {currentAnswers && (
        <Timer time={timerValue} className="absolute top-13 left-20" />
      )}
      <Question
        stage={stage}
        text={currentQuestion?.text || "Loading question..."}
      />

      <div className="w-full flex items-center justify-center gap-7 mt-5">
        {currentAnswers && (
          <>
            <AnswerOption
              text={currentAnswers?.[0]?.answer}
              isVisible={showAnswers}
              position="left"
              isSelected={selectedAnswer === 0}
              onSelect={() => handleSelect(0)}
            />
            <OrButton isVisible={showAnswers} />
            <AnswerOption
              text={currentAnswers?.[1]?.answer}
              isVisible={showAnswers}
              position="right"
              isSelected={selectedAnswer === 1}
              onSelect={() => handleSelect(1)}
            />
          </>
        )}
      </div>

      {showAnswers && selectedAnswer !== null && (
        <motion.div
          className="absolute bottom-[7%]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            className={cn(
              "text-2xl px-10 py-7 bg-chart-2 hover:bg-chart-2/90 border-3 border-black rounded-2xl! active:scale-91",
              {
                "opacity-50 cursor-not-allowed": hasVoted,
              }
            )}
            onClick={handleSubmit}
            disabled={hasVoted}
          >
            {hasVoted ? "Голос учтён" : "Голосовать"}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
