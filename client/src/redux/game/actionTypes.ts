import { PlayerState } from "./gameSlice";

export type GameSocketAction =
  | {
      type: "game/initGame";
      payload: { playerName: string; status: PlayerState["status"] };
    }
  | {
      type: "game/joinGame";
      payload: {
        playerName: string;
        gameCode: string;
        status: PlayerState["status"];
      };
    };
