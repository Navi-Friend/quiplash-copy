import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useEffect, useState, useCallback, memo, useRef } from "react";
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
import { useNavigate } from "react-router-dom";
import { routes } from "@/lib/routes";
import { PlayerState } from "@/redux/game/gameSlice";
import { socket } from "@/api/socket";
import { EVENTS } from "@/api/events";
import store from "@/redux/store";

export enum Stages {
  SHOW_QUESTION,
  VOTING,
  RESULTS,
}

const MemoizedQuestion = memo(Question);
const MemoizedAnswerOption = memo(AnswerOption);
const MemoizedOrButton = memo(OrButton);

export function VotingPage() {
  const [reloadKey, setReloadKey] = useState(0);
  const gameState = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const hasRequestedNextQuestion = useRef(false);

  const forceReload = () => {
    setReloadKey((prev) => prev + 1);
  };

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
  ) as PlayerState;
  const player2 = gameState.players.find(
    (p) => p.playerName == gameState.currentAnswersForVoting?.[1].playerName
  ) as PlayerState;

  useEffect(() => {
    if (stage === Stages.SHOW_QUESTION) {
      const timer = setTimeout(() => {
        const hasEmptyAnswer = gameState.currentAnswersForVoting?.some(
          (answer) => !answer.answer.trim()
        );

        if (
          hasEmptyAnswer ||
          gameState.currentAnswersForVoting?.[0].answer ==
            gameState.currentAnswersForVoting?.[1].answer
        ) {
          setStage(Stages.RESULTS);
          setIsTimeExpired(true);
        } else {
          setStage(Stages.VOTING);
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [stage, gameState.currentAnswersForVoting]);

  useEffect(() => {
    if (stage === Stages.RESULTS) {
      setPlayer1Score(player1.score || 0);
      setPlayer2Score(player2.score || 0);
      console.log("1");
      if (!hasRequestedNextQuestion.current) {
        hasRequestedNextQuestion.current = true;
        console.log("2");

        setTimeout(() => {
          if (
            gameState.currentQuestionForVotingIndex <=
            gameState.availableQuestionsForVoting.length - 1
          ) {
            console.log("3");

            if (gameState.player?.status === "VIP") {
              console.log("4");

              dispatch<GameSocketAction>({
                type: "game/questionForVoting",
                payload: {
                  questionId:
                    gameState.availableQuestionsForVoting[
                      gameState.currentQuestionForVotingIndex
                    ],
                  roundId: gameState.roundId,
                  gameCode: gameState.gameCode,
                },
              });
            }
          } else {
            navigate(routes.leaderboard);
          }
        }, 3000);
      }
    }
  }, [stage, gameState, dispatch, navigate]);

  useEffect(() => {
    const handleNewQuestion = () => {
      setStage(Stages.SHOW_QUESTION);
      setSelectedAnswer(null);
      setHasVoted(false);
      setIsTimeExpired(false);
      hasRequestedNextQuestion.current = false;
      forceReload();
    };

    console.log("handleNewQuestion");
    socket.on(EVENTS.questionForVotiong, handleNewQuestion);
    return () => {
      socket.off(EVENTS.questionForVotiong, handleNewQuestion);
    };
  }, []);

  const handleSubmit = useCallback(() => {
    if (
      selectedAnswer !== null &&
      currentAnswers &&
      !hasVoted &&
      !isTimeExpired
    ) {
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
    const currentAnswers = gameState.currentAnswersForVoting;

    console.log("handleTimeExpired debug:", {
      isVip: gameState.player?.status === "VIP",
      currentIndex: gameState.currentQuestionForVotingIndex,
      totalQuestions: gameState.availableQuestionsForVoting.length,
      hasAnswers: !!currentAnswers,
      answers: currentAnswers,
    });

    if (
      gameState.player?.status === "VIP" &&
      gameState.currentQuestionForVotingIndex <=
        gameState.availableQuestionsForVoting.length &&
      currentAnswers
    ) {
      console.log("timer dispatch voting results", currentAnswers);
      dispatch<GameSocketAction>({
        type: "game/votingResults",
        payload: {
          roundId: gameState.roundId,
          gameCode: gameState.gameCode,
          answerId1: currentAnswers[0].answerId,
          answerId2: currentAnswers[1].answerId,
        } as {
          roundId: string;
          gameCode: string;
          answerId1: string;
          answerId2: string;
        },
      });
    }
    setStage(Stages.RESULTS);
    setIsTimeExpired(true);
  }, [dispatch, gameState.currentAnswersForVoting?.[0].answerId]);

  return (
    <div
      key={reloadKey}
      className="w-full min-h-[95vh] flex items-center justify-center flex-col relative"
    >
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
                  className="absolute -bottom-[70%] -right-[5%]"
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
