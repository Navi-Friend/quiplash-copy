import { Middleware } from "@reduxjs/toolkit";
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
      console.log(data);
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
