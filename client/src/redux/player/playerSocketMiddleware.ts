import {
  Dispatch,
  Middleware,
  MiddlewareAPI,
  UnknownAction,
} from "@reduxjs/toolkit";
import { PlayerState, setPlayer } from "./playerSlice";
import { PlayerSocketAction } from "./actionTypes";
import { socket } from "@/api/socket";
import { GameState } from "../game/gameSlice";

export const playerSocketMiddleware =
  (): Middleware<{}, { player: PlayerState; game: GameState }> =>
  (store) =>
  (next) =>
  async (action) => {
    if (!isPlayerSocketAction(action)) {
      return next(action);
    }

    if (action.type == "player/createPlayer") {
      store.dispatch(
        setPlayer({
          playerName: action.payload.playerName,
          status: action.payload.status,
          avatarURL: resolveAvatar(store),
          score: 0,
        })
      );
    }

    return next(action);
  };

const isPlayerSocketAction = (action: unknown): action is PlayerSocketAction =>
  typeof action === "object" &&
  action !== null &&
  "type" in action &&
  typeof action.type === "string" &&
  action.type == "player/createPlayer";

const resolveAvatar = (
  store: MiddlewareAPI<
    Dispatch<UnknownAction>,
    {
      player: PlayerState;
      game: GameState;
    }
  >
): string => {
  const playerNumberToAvatar: { [key: number]: string } = {
    1: "blue",
    2: "coffin",
    3: "green",
    4: "orange",
    5: "purple",
    6: "red",
    7: "teal",
    8: "yellow",
  };

  const playerNumber = store.getState().game.playerNumber as number;
  const avatarName = playerNumberToAvatar[playerNumber];

  return `../../../public/${avatarName}.webp`; 
};
