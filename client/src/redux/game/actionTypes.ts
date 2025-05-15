<<<<<<< HEAD
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
=======
import { PayloadAction } from "@reduxjs/toolkit";

// export interface middlewareAction extends PayloadAction {
//   type: actionType;
//   payload: void
// }

export type SocketAction =
  | { type: "game/initGame"; payload: { playerName: string } }
  | { type: "game/joinGame"; payload: { playerName: string; gameCode: string } };
>>>>>>> 4232884e57e49db34666d24b5f40adfa7e408675
