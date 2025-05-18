import { io } from "socket.io-client";
import { EVENTS } from "./events";
import {
  PlayerModel,
  QuestionForVoting,
  SocketAnswer,
  StartGame,
  VoteModel,
  VotingResultsAnswer,
} from "@/types";
import { resolveAvatar } from "@/lib/utils";
import {
  addAnsweredPlayer,
  setAvailableQuestionsForVoting,
  setPlayerQuestions,
  setPlayers,
  setQuestionForVoting,
  setRoundId,
  setTimer,
  updatePlayers,
} from "@/redux/game/gameSlice";
import store from "@/redux/store";

export const socket = io("localhost:8000", { withCredentials: true });

socket.on("connect", () => {
  console.log(socket.id);
});

socket.on(EVENTS.playerJoined, (data: SocketAnswer<PlayerModel[]>) => {
  if (data.data) {
    store.dispatch(
      setPlayers(
        data.data.map((p) => ({
          playerName: p.name,
          status: p.avatarNumber == 1 ? "VIP" : "normal",
          avatarURL: resolveAvatar(p.avatarNumber),
          score: p.score,
        }))
      )
    );
  }
});

socket.on(EVENTS.gameStarted, (data: SocketAnswer<StartGame>) => {
  if (data.data) {
    console.log(data);
    store.dispatch(setPlayerQuestions(data.data.questoins));
    store.dispatch(
      setTimer({
        duration: data.data.duration,
        startTime: data.data.startTime,
      })
    );
    store.dispatch(setRoundId(data.data.roundId));

    const IDs = data.data.questoins.flatMap((q) => [
      q.question1.questionId,
      q.question2.questionId,
    ]);
    store.dispatch(setAvailableQuestionsForVoting(IDs));
  }
});

socket.on(EVENTS.playerAnswered, (data: SocketAnswer<string>) => {
  if (data.data) {
    console.log(data);
    store.dispatch(addAnsweredPlayer(data.data));
  }
});

socket.on(
  EVENTS.questionForVotiong,
  (data: SocketAnswer<QuestionForVoting>) => {
    if (data.data) {
      console.log(data);
      store.dispatch(
        setQuestionForVoting({
          question: data.data.question,
          answers: data.data.answers,
        })
      );
      store.dispatch(
        setTimer({
          duration: data.data.duration,
          startTime: data.data.startTime,
        })
      );
    }
  }
);

socket.on(EVENTS.sendVotes, (data: SocketAnswer<VoteModel[]>) => {
  if (data.data) {
    console.log(data.data);
  }
});

socket.on(
  EVENTS.pointsCalculated,
  (data: SocketAnswer<VotingResultsAnswer>) => {
    if (data.data) {
      const player1 = store
        .getState()
        .game.players.find((p) => p.playerName == data.data!.player1.name);
      const player2 = store
        .getState()
        .game.players.find((p) => p.playerName == data.data!.player2.name);
      store.dispatch(
        updatePlayers({
          playerName: player1!.playerName,
          avatarURL: player1!.avatarURL,
          status: player1!.status,
          score: data.data.player1.score,
        })
      );

      store.dispatch(
        updatePlayers({
          playerName: player2!.playerName,
          avatarURL: player2!.avatarURL,
          status: player2!.status,
          score: data.data.player2.score,
        })
      );
    }
  }
);
