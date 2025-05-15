import { Middleware } from "@reduxjs/toolkit";
<<<<<<< HEAD
import { GameSocketAction } from "./actionTypes";
import {
  addError,
  GameState,
  setGameCode,
  setPlayer,
  setPlayers,
} from "./gameSlice";
import { socket } from "@/api/socket";
import { InitGame, JoinGame, PlayerModel, SocketAnswer } from "@/types";
import { EVENTS } from "@/api/events";
import { resolveAvatar } from "@/lib/utils";
=======
import { SocketAction } from "./actionTypes";
import {
  setPlayers,
  // setQuestion,
  // addAnswer,
  // addVote,
  // setGameStatus,
  GameState,
  setGameCode,
} from "./gameSlice";
import { socket } from "@/api/socket";
>>>>>>> 4232884e57e49db34666d24b5f40adfa7e408675

export const gameSocketMiddleware =
  (): Middleware<{}, { game: GameState }> =>
  (store) =>
  (next) =>
  async (action) => {
<<<<<<< HEAD
    if (!isGameSocketAction(action)) {
=======
    // Инициализация подключения при старте приложения
    // if (action.type === "socket/connect") {
    // Подписка на события от сервера

    const isSocketAction = (action: unknown): action is SocketAction =>
      typeof action === "object" &&
      action !== null &&
      "type" in action &&
      typeof action.type === "string";

    if (!isSocketAction(action)) {
>>>>>>> 4232884e57e49db34666d24b5f40adfa7e408675
      return next(action);
    }

    if (action.type == "game/initGame") {
<<<<<<< HEAD
      const response = (await socket.emitWithAck(
        EVENTS.initGame,
        action.payload
      )) as SocketAnswer<InitGame>;
      console.log(response, response.data!.game.gameCode);

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
      console.log(action.payload);
      const response = (await socket.emitWithAck(
        EVENTS.joinGame,
        action.payload
      )) as SocketAnswer<JoinGame>;

      if (response.data) {
        console.log(response, response.data.player.name);
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

    socket.on(EVENTS.playerJoined, (data: SocketAnswer<PlayerModel[]>) => {
      console.log(data)
      if (data.data) {
        console.log(data);
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

    return next(action);
  };

const isGameSocketAction = (action: unknown): action is GameSocketAction =>
  typeof action === "object" &&
  action !== null &&
  "type" in action &&
  typeof action.type === "string" &&
  (action.type == "game/initGame" || action.type == "game/joinGame");
=======
      const response = await socket.emitWithAck("initGame", action.payload);
      console.log(response);
      store.dispatch(setGameCode(response));
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
>>>>>>> 4232884e57e49db34666d24b5f40adfa7e408675
