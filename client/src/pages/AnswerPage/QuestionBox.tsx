import { Input, Button } from "@/components/ui";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { cn } from "@/lib/utils";
import { GameSocketAction } from "@/redux/game/actionTypes";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "react-toastify";

const MAX_ANSWER_LENGTH = 70;

export function QuestionBox() {
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [isHidden, setIsHidden] = useState(false);
  const [isFirstAnswered, setIsFirstAnswered] = useState(false);

  const gameState = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();

  const questionObj = gameState.playerQuestions?.find(
    (q) => q.playerName == gameState.player?.playerName
  );

  const handleAnswer = () => {
    setIsFirstAnswered(true);
    dispatch<GameSocketAction>({
      type: "game/sendAnswer",
      payload: {
        playerName: gameState.player?.playerName,
        gameCode: gameState.gameCode,
        answer: isFirstAnswered ? answer2 : answer1,
        questionId: isFirstAnswered
          ? questionObj?.question2.questionId
          : questionObj?.question1.questionId,
        roundId: gameState.roundId,
      } as {
        playerName: string;
        gameCode: string;
        answer: string;
        questionId: number;
        roundId: string;
      },
    });
  };

  useEffect(() => {
    const hasAllAnswers = gameState.answeredPlayers.find(
      (p) => p.playerName == gameState.player?.playerName && p.answers == 2
    );
    if (gameState.error && !toast.isActive("warnToast")) {
      toast.warn(gameState.error.message, {
        toastId: "warnToast",
      });
    }
    if (hasAllAnswers || gameState.currentQuestionForVoting) {
      setIsHidden(true);
    }
  }, [gameState]);

  return (
    <AnimatePresence>
      {!isHidden && (
        <motion.div
          key={"QuestionBox"}
          exit={{ opacity: 0 }}
          className="w-2/3 h-80"
        >
          <div
            className={cn(
              "bg-white rounded-xl h-3/4 text-4xl font-semibold text-gray-800! flex items-center justify-center",
              { hidden: isFirstAnswered }
            )}
          >
            <span>{questionObj?.question1.text}</span>
          </div>
          <div
            className={cn(
              "bg-white rounded-xl h-3/4 text-4xl font-semibold text-gray-800! flex items-center justify-center",
              { hidden: !isFirstAnswered }
            )}
          >
            {questionObj?.question2.text}
          </div>
          <div className="flex gap-2 mt-4">
            <Input
              value={isFirstAnswered ? answer2 : answer1}
              type="text"
              maxLength={MAX_ANSWER_LENGTH}
              className="p-7 text-lg! bg-white font-medium"
              placeholder="Your answer"
              onChange={(e) => {
                isFirstAnswered
                  ? setAnswer2(e.target.value)
                  : setAnswer1(e.target.value);
              }}
            />
            <Button
              className="h-auto text-xl active:scale-96"
              onClick={handleAnswer}
              disabled={isHidden}
            >
              Ответить
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
