import { PlayerState } from "./playerSlice";

export type PlayerSocketAction = {
  type: "player/createPlayer";
  payload: { status: PlayerState["status"]; playerName: string };
};
