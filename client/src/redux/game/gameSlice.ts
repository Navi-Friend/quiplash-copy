<<<<<<< HEAD
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
  shouldNavigateToHome?: boolean;
=======
import { Player } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GameState {
  players: Player[];
  currentRound: number;
  gameCode: string;
>>>>>>> 4232884e57e49db34666d24b5f40adfa7e408675
}

const initialState: GameState = {
  players: [],
<<<<<<< HEAD
  player: null,
  currentRound: 0,
  gameCode: "",
  error: null,
  shouldNavigateToHome: true,
=======
  currentRound: 0,
  gameCode: "",
>>>>>>> 4232884e57e49db34666d24b5f40adfa7e408675
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
<<<<<<< HEAD
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
    setShouldNavigateToHome: (state, action: PayloadAction<boolean>) => {
      state.shouldNavigateToHome = action.payload;
    },

    setGameCode: (state, action: PayloadAction<string>) => {
      state.gameCode = action.payload;
    },
    // setPlayerNumber: (state, action: PayloadAction<number>) => {
    //   state.playerNumber = action.payload;
    // },
=======
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
>>>>>>> 4232884e57e49db34666d24b5f40adfa7e408675
  },
});

export const {
  setPlayers,
<<<<<<< HEAD
  setPlayer,
  addError,
  setShouldNavigateToHome,
=======
  // setQuestion,
  // addAnswer,
  // addVote,
  // setGameStatus,
>>>>>>> 4232884e57e49db34666d24b5f40adfa7e408675
  setGameCode,
} = gameSlice.actions;
export default gameSlice.reducer;
