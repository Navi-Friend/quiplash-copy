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
import { Avatar } from "@/components/common";

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
  const [player1Score, setPlayer1Score] = useState<number>(0);
  const [player2Score, setPlayer2Score] = useState<number>(0);

  const showAnswers = stage !== Stages.SHOW_QUESTION;
  const currentQuestion = gameState.currentQuestionForVoting;
  const currentAnswers = gameState.currentAnswersForVoting as [
    AnswerModel,
    AnswerModel
  ];
  const player1 = gameState.players.find(
    (p) => p.playerName == gameState.currentAnswersForVoting?.[0].playerName
  );
  const player2 = gameState.players.find(
    (p) => p.playerName == gameState.currentAnswersForVoting?.[1].playerName
  );

  useEffect(() => {
    if (stage === Stages.SHOW_QUESTION) {
      const timer = setTimeout(() => {
        setStage(Stages.VOTING);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === Stages.RESULTS) {
      // Get scores from players array
      const player1Score = player1?.score || 0;
      const player2Score = player2?.score || 0;

      // Animate score counting
      const duration = 1000; // 1 second
      const steps = 20;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        const progress = currentStep / steps;
        setPlayer1Score(Math.floor(player1Score * progress));
        setPlayer2Score(Math.floor(player2Score * progress));

        currentStep++;
        if (currentStep > steps) {
          clearInterval(interval);
          setPlayer1Score(player1Score);
          setPlayer2Score(player2Score);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }
  }, [stage, player1?.score, player2?.score]);

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
    setStage(Stages.RESULTS);
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
            <div className="relative">
              <MemoizedAnswerOption
                text={currentAnswers[0].answer}
                isVisible={showAnswers}
                position="left"
                isSelected={selectedAnswer === 0}
                onSelect={() => handleSelect(0)}
                disabled={isTimeExpired}
              />
              {stage === Stages.RESULTS && player1 && (
                <Avatar
                  avatarURL={player1.avatarURL}
                  isVip={player1.status === "VIP"}
                  name={player1.playerName}
                  className="absolute -bottom-[75%] -left-[5%]"
                  score={player1Score}
                  showScore={true}
                />
              )}
            </div>
            <MemoizedOrButton isVisible={showAnswers} />
            <div className="relative">
              <MemoizedAnswerOption
                text={currentAnswers[1].answer}
                isVisible={showAnswers}
                position="right"
                isSelected={selectedAnswer === 1}
                onSelect={() => handleSelect(1)}
                disabled={isTimeExpired}
              />
              {stage === Stages.RESULTS && player2 && (
                <Avatar
                  avatarURL={player2.avatarURL}
                  isVip={player2.status === "VIP"}
                  name={player2.playerName}
                  className="absolute -bottom-[75%] -right-[5%]"
                  score={player2Score}
                  showScore={true}
                />
              )}
            </div>
          </>
        )}
      </div>

      {!isTimeExpired && selectedAnswer !== null && (
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
