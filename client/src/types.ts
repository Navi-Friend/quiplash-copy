export interface Player {
  playerName: string;
  score: number;
<<<<<<< HEAD
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
=======
}
>>>>>>> 4232884e57e49db34666d24b5f40adfa7e408675
