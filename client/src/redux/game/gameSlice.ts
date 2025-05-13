import { Player } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GameState {
  players: Player[];
  currentRound: number;
  gameCode: string;
  playerNumber: number | null;
}

const initialState: GameState = {
  players: [],
  currentRound: 0,
  gameCode: "",
  playerNumber: null,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setPlayers: (state, action: PayloadAction<Player[]>) => {
      state.players = action.payload;
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
  // setQuestion,
  // addAnswer,
  // addVote,
  // setGameStatus,
  setPlayerNumber,
  setGameCode,
} = gameSlice.actions;
export default gameSlice.reducer;
