import { Player, SocketAnswerError } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PlayerState extends Player {
  status: "VIP" | "normal" | "spectator" | null;
  avatarURL: string;
}

export interface GameState {
  players: PlayerState[];
  player: PlayerState | null;
  currentRound: number;
  gameCode: string;
  error: SocketAnswerError | null;
}

const initialState: GameState = {
  players: [],
  player: null,
  currentRound: 0,
  gameCode: "",
  error: null,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setPlayers: (state, action: PayloadAction<PlayerState[]>) => {
      state.players = action.payload;
    },
    setPlayer: (state, action: PayloadAction<PlayerState>) => {
      state.player = action.payload;
    },
    addError: (state, action: PayloadAction<typeof state.error>) => {
      if (action.payload) {
        const existing = state.error?.message == action.payload.message;
        if (!existing) {
          state.error = action.payload;
        }
      } else {
        state.error = null;
      }
    },
    // setShouldNavigateToHome: (state, action: PayloadAction<boolean>) => {
    //   state.shouldNavigateToHome = action.payload;
    // },

    setGameCode: (state, action: PayloadAction<string>) => {
      state.gameCode = action.payload;
    },
    resetState: () => initialState,
  },
});

export const { setPlayers, setPlayer, addError, setGameCode, resetState } =
  gameSlice.actions;
export default gameSlice.reducer;
