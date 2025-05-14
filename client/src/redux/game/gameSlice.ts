import { Player, SocketAnswerError } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GameState {
  players: Player[];
  currentRound: number;
  gameCode: string;
  playerNumber: number | null;
  error: SocketAnswerError | null;
}

const initialState: GameState = {
  players: [],
  currentRound: 0,
  gameCode: "",
  playerNumber: null,
  error: null,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setPlayers: (state, action: PayloadAction<Player[]>) => {
      state.players = action.payload;
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
    // setQuestion: (state, action) => {
    //   state.currentQuestion = action.payload;
    // },
    // addAnswer: (state, action) => {
    //   const { playerId, answer } = action.payload;
    //   state.answers[playerId] = answer;
    // },
    // addVote: (state, action) => {
    //   const { voterId, answerId } = action.payload;
    //   state.votes[voterId] = answerId;
    // },
    // setGameStatus: (state, action) => {
    //   state.gameStatus = action.payload;
    // },
    setGameCode: (state, action: PayloadAction<string>) => {
      state.gameCode = action.payload;
    },
    setPlayerNumber: (state, action: PayloadAction<number>) => {
      state.playerNumber = action.payload;
    },
  },
});

export const {
  setPlayers,
  addError,
  // setQuestion,
  // addAnswer,
  // addVote,
  // setGameStatus,
  setPlayerNumber,
  setGameCode,
} = gameSlice.actions;
export default gameSlice.reducer;
