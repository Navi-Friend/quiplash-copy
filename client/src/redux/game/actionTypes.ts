import { PayloadAction } from "@reduxjs/toolkit";

// export interface middlewareAction extends PayloadAction {
//   type: actionType;
//   payload: void
// }

export type SocketAction =
  | { type: "game/initGame"; payload: { playerName: string } }
  | { type: "game/joinGame"; payload: { playerName: string; gameCode: string } };
