export interface Player {
  playerName: string;
  score: number;
}

export enum GameStatus {
  not_started = "NOT_STARTED",
  wait_players = "WAIT_PLAYERS",
  start_game = "START_GAME",
  wait_question_answers = "WAIT_QUESTION_ANSWERS",
  active = "ACTIVE",
  ended = "ENDED",
}

export interface GameModel {
  gameCode: string;
  totalRounds: number;
  currentRound: number;
  maxPlayers: number;
  currentPlayers: number;
  gameStatus: GameStatus;
  spectators: number;
}

export type SocketAnswer<T> = {
  status: "OK" | "!OK";
  data?: T;
  errors?: SocketAnswerError;
};

export interface InitGame {
  game: {
    currentPlayers: number;
    currentRound: number;
    gameCode: string;
    gameStatus: string;
    maxPlayers: number;
    spectators: number;
    totalRounds: number;
  };
}

export interface SocketAnswerError {
  name: string;
  message: string;
  timestamp: string;
  details?: string;
}

export interface JoinGame {
  player: PlayerModel;
}

export interface PlayerModel {
  playerId: string;
  name: string;
  score: number;
  avatarNumber: number;
}

export interface StartGame {
  game: GameModel;
  players: PlayerModel;
  questoins: PlayerQuestions[];
  startTime: number;
  roundId: string;
  duration: number;
}

export type PlayerQuestions = {
  playerName: string;
  question1: { questionId: number; text: string };
  question2: { questionId: number; text: string };
};

export interface AnswerModel {
  answerId: string;
  playerName: string;
  answer: string;
  questionId: number;
}

export interface QuestionModel {
  questionId: number;
  text: string;
}

export interface QuestionForVoting {
  question: QuestionModel;
  answers: [AnswerModel, AnswerModel];
  startTime: number;
  duration: number;
}

export interface VoteModel {
	voteId: string;
	answerId: string;
	playerName: string;
}
