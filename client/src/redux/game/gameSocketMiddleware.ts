import { Middleware } from "@reduxjs/toolkit";
import { GameSocketAction } from "./actionTypes";
import {
  addAnsweredPlayer,
  addError,
  GameState,
  nextQuestionForVoting,
  setAvailableQuestionsForVoting,
  setGameCode,
  setPlayer,
  setPlayerQuestions,
  setPlayers,
  setQuestionForVoting,
  setRoundId,
  setTimer,
} from "./gameSlice";
import { socket } from "@/api/socket";
import {
  GameModel,
  InitGame,
  JoinGame,
  PlayerModel,
  QuestionForVoting,
  SocketAnswer,
  StartGame,
} from "@/types";
import { EVENTS } from "@/api/events";
import { resolveAvatar } from "@/lib/utils";

export const gameSocketMiddleware =
  (): Middleware<{}, { game: GameState }> =>
  (store) =>
  (next) =>
  async (action) => {
    if (!isGameSocketAction(action)) {
      return next(action);
    }

    if (action.type == "game/initGame") {
      const response = (await socket.emitWithAck(
        EVENTS.initGame,
        action.payload
      )) as SocketAnswer<InitGame>;

      if (response.data) {
        const player = {
          playerName: action.payload.playerName,
          status: action.payload.status,
          avatarURL: resolveAvatar(response.data.game.currentPlayers),
          score: 0,
        };

        store.dispatch(setGameCode(response.data.game.gameCode));
        store.dispatch(setPlayers([player]));
        store.dispatch(setPlayer(player));
      }
    }

    if (action.type == "game/joinGame") {
      // console.log(action.payload);
      const response = (await socket.emitWithAck(
        EVENTS.joinGame,
        action.payload
      )) as SocketAnswer<JoinGame>;

      if (response.data) {
        // console.log(response, response.data.player.name);
        store.dispatch(setGameCode(action.payload.gameCode));
        store.dispatch(
          setPlayer({
            playerName: response.data.player.name,
            avatarURL: resolveAvatar(response.data.player.avatarNumber),
            score: 0,
            status: action.payload.status,
          })
        );
        store.dispatch(addError(null));
      }

      if (response.errors) {
        store.dispatch(addError(response.errors));
        console.log(store.getState().game.error);
      }
    }

    if (action.type == "game/startGame") {
      const response = (await socket.emitWithAck(EVENTS.startGame, {
        gameCode: store.getState().game.gameCode,
      })) as SocketAnswer<GameModel>;

      if (response.errors) {
        store.dispatch(addError(response.errors));
      } else {
        store.dispatch(addError(null));
      }
    }

    if (action.type == "game/sendAnswer") {
      const response = (await socket.emitWithAck(
        EVENTS.answerQuestion,
        action.payload
      )) as SocketAnswer<void>;
      console.log(action.payload, response);
      if (response.errors) {
        store.dispatch(addError(response.errors));
      } else {
        store.dispatch(addError(null));
      }
    }

    if (action.type == "game/questionForVoting") {
      const response = (await socket.emitWithAck(
        EVENTS.requestQuestionForVoting,
        action.payload
      )) as SocketAnswer<void>;

      if (response.errors) {
        store.dispatch(addError(response.errors));
      } else {
        store.dispatch(addError(null));
      }

      store.dispatch(nextQuestionForVoting());
    }

    return next(action);
  };

const isGameSocketAction = (action: unknown): action is GameSocketAction =>
  typeof action === "object" &&
  action !== null &&
  "type" in action &&
  typeof action.type === "string" &&
  (action.type == "game/initGame" ||
    action.type == "game/joinGame" ||
    action.type == "game/startGame" ||
    action.type == "game/sendAnswer" ||
    action.type == "game/questionForVoting");
