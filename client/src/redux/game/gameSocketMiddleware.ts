import { Middleware } from "@reduxjs/toolkit";
import { GameSocketAction } from "./actionTypes";
import {
  // setPlayers,
  // setQuestion,
  // addAnswer,
  // addVote,
  // setGameStatus,
  GameState,
  setGameCode,
  setPlayerNumber,
} from "./gameSlice";
import { socket } from "@/api/socket";
import { InitGame, SocketAnswer } from "@/types";

export const gameSocketMiddleware =
  (): Middleware<{}, { game: GameState }> =>
  (store) =>
  (next) =>
  async (action) => {
    // Инициализация подключения при старте приложения
    // if (action.type === "socket/connect") {
    // Подписка на события от сервера

    if (!isGameSocketAction(action)) {
      return next(action);
    }

    if (action.type == "game/initGame") {
      const response = (await socket.emitWithAck(
        "initGame",
        action.payload
      )) as SocketAnswer<InitGame>;
      console.log(response, response.data!.game.gameCode);
      store.dispatch(setGameCode(response.data!.game.gameCode));
      store.dispatch(setPlayerNumber(response.data!.game.currentPlayers));
    }

    // socket.on("players_update", (players) => {
    //   store.dispatch(setPlayers(players));
    // });

    // socket.on("new_question", (question) => {
    //   store.dispatch(setQuestion(question));
    //   store.dispatch(setGameStatus("answering"));
    // });

    // socket.on("new_answer", ({ playerId, answer }) => {
    //   store.dispatch(addAnswer({ playerId, answer }));
    // });

    // socket.on("new_vote", ({ voterId, answerId }) => {
    //   store.dispatch(addVote({ voterId, answerId }));
    // });

    // socket.on("game_state", (gameState) => {
    //   // Обновляем всё состояние игры (например, при переподключении)
    //   store.dispatch(setPlayers(gameState.players));
    //   store.dispatch(setQuestion(gameState.currentQuestion));
    //   // ... и так далее
    // });
    // }

    // Отправка действий на сервер (если нужно)
    // if (action.type === "game/submitAnswer" && socket) {
    //   socket.emitWithAck("submit_answer", action.payload);
    // }

    // if (action.type === "game/submitVote" && socket) {
    //   socket.emit("submit_vote", action.payload);
    // }

    return next(action);
  };

const isGameSocketAction = (action: unknown): action is GameSocketAction =>
  typeof action === "object" &&
  action !== null &&
  "type" in action &&
  typeof action.type === "string" &&
  (action.type == "game/initGame" || action.type == "game/joinGame");
