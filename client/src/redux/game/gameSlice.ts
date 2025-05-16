import {
  Player,
  PlayerQuestions,
  QuestionModel,
  SocketAnswerError,
} from "@/types";
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
  playerQuestions: PlayerQuestions[] | null;
  timer: { duration: number; startTime: number } | null;
  answeredPlayers: { playerName: string; answers: number }[];
  roundId: string;
  currentQuestionForVoting: QuestionModel | null;
  currentQuestionForVotingIndex: number;
  availableQuestionsForVoting: number[];
}

const initialState: GameState = {
  players: [],
  player: null,
  currentRound: 0,
  gameCode: "",
  error: null,
  playerQuestions: null,
  timer: null,
  answeredPlayers: [],
  roundId: "",
  currentQuestionForVoting: null,
  currentQuestionForVotingIndex: 0,
  availableQuestionsForVoting: [],
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
    setGameCode: (state, action: PayloadAction<string>) => {
      state.gameCode = action.payload;
    },
    setPlayerQuestions: (state, action: PayloadAction<PlayerQuestions[]>) => {
      state.playerQuestions = action.payload;
    },
    setTimer: (
      state,
      action: PayloadAction<NonNullable<GameState["timer"]>>
    ) => {
      if (!state.timer) {
        state.timer = {
          duration: action.payload.duration,
          startTime: action.payload.startTime,
        };
      }
      state.timer.duration = action.payload?.duration;
      state.timer.startTime = action.payload?.startTime;
    },
    setRoundId: (state, action: PayloadAction<string>) => {
      state.roundId = action.payload;
    },
    addAnsweredPlayer: (state, action: PayloadAction<string>) => {
      let playerObj = state.answeredPlayers.find(
        (p) => p.playerName == action.payload
      );

      if (!playerObj) {
        state.answeredPlayers.push({ playerName: action.payload, answers: 1 });
      } else {
        playerObj!.answers += 1;
      }
    },
    setAvailableQuestionsForVoting: (
      state,
      action: PayloadAction<number[]>
    ) => {
      state.availableQuestionsForVoting = action.payload;
    },
    setQuestionForVoting: (state, action: PayloadAction<QuestionModel>) => {
      state.currentQuestionForVoting = action.payload;
    },
    nextQuestionForVoting: (state) => {
      state.currentQuestionForVotingIndex += 1;
    },
    resetState: () => initialState,
  },
});

export const {
  setPlayers,
  setPlayer,
  addError,
  setGameCode,
  resetState,
  setPlayerQuestions,
  setTimer,
  addAnsweredPlayer,
  setRoundId,
  setQuestionForVoting,
  nextQuestionForVoting,
  setAvailableQuestionsForVoting,
} = gameSlice.actions;
export default gameSlice.reducer;
