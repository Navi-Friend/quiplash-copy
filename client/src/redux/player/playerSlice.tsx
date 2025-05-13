import { Player } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PlayerState extends Player {
  status: "VIP" | "normal" | "spectator" | null;
  avatarURL: string | null;
}

const initialState: PlayerState = {
  status: null,
  avatarURL: null,
  playerName: "",
  score: 0,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlayer(state, action: PayloadAction<PlayerState>) {
      state.status = action.payload.status;
      state.playerName = action.payload.playerName;
      state.avatarURL = action.payload.avatarURL;
      state.score = action.payload.score || 0;
    },

  },
});

export const { setPlayer } = playerSlice.actions;
export default playerSlice.reducer;
