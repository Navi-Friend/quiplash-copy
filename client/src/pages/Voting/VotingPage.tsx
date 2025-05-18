import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useEffect, useState, useCallback, memo } from "react";
import { Question } from "./Question";
import { AnswerOption } from "./AnswerOption";
import { Button } from "@/components/ui/button";
import { GameSocketAction } from "@/redux/game/actionTypes";
import { motion } from "framer-motion";
import { OrButton } from "./OrButton";
import { cn } from "@/lib/utils";
import { VotingTimer } from "./VotingTimer";
import { AnswerModel } from "@/types";

export enum Stages {
  SHOW_QUESTION,
  VOTING,
  RESULTS,
}

const MemoizedQuestion = memo(Question);
const MemoizedAnswerOption = memo(AnswerOption);
const MemoizedOrButton = memo(OrButton);

export function VotingPage() {
  const gameState = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();

  const [stage, setStage] = useState<Stages>(Stages.SHOW_QUESTION);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isTimeExpired, setIsTimeExpired] = useState(false);

  useEffect(() => {
    if (stage === Stages.SHOW_QUESTION) {
      const timer = setTimeout(() => {
        setStage(Stages.VOTING);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [stage]);

  const showAnswers = stage !== Stages.SHOW_QUESTION;
  const currentQuestion = gameState.currentQuestionForVoting;
  const currentAnswers = gameState.currentAnswersForVoting as [
    AnswerModel,
    AnswerModel
  ];

  const handleSubmit = useCallback(() => {
    if (
      selectedAnswer !== null &&
      currentAnswers &&
      !hasVoted &&
      !isTimeExpired
    ) {
      console.log("voting");
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
    }
  }, [
    selectedAnswer,
    currentAnswers,
    hasVoted,
    isTimeExpired,
    dispatch,
    gameState,
  ]);

  const handleSelect = useCallback(
    (index: number) => {
      if (!hasVoted && !isTimeExpired) {
        setSelectedAnswer(index);
      }
    },
    [hasVoted, isTimeExpired]
  );

  const handleTimeExpired = useCallback(() => {
    setIsTimeExpired(true);
  }, []);

  return (
    <div className="w-full min-h-[95vh] flex items-center justify-center flex-col relative">
      {showAnswers && <VotingTimer onTimeExpired={handleTimeExpired} />}
      <MemoizedQuestion
        stage={stage}
        text={currentQuestion?.text || "Loading question..."}
      />

      <div className="w-full flex items-center justify-center gap-7 mt-5">
        {currentAnswers && (
          <>
            <MemoizedAnswerOption
              text={currentAnswers[0].answer}
              isVisible={showAnswers}
              position="left"
              isSelected={selectedAnswer === 0}
              onSelect={() => handleSelect(0)}
              disabled={isTimeExpired}
            />
            <MemoizedOrButton isVisible={showAnswers} />
            <MemoizedAnswerOption
              text={currentAnswers[1].answer}
              isVisible={showAnswers}
              position="right"
              isSelected={selectedAnswer === 1}
              onSelect={() => handleSelect(1)}
              disabled={isTimeExpired}
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
                "opacity-50": hasVoted || isTimeExpired,
              }
            )}
            onClick={handleSubmit}
            disabled={hasVoted || isTimeExpired}
          >
            {hasVoted
              ? "Голос учтён"
              : isTimeExpired
              ? "Время вышло"
              : "Голосовать"}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
