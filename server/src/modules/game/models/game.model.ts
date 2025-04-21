import { GameStatus } from '../entities/game/gameStatus';

export interface GameModel {
	gameId: string;
	gameCode: string;
	totalRounds: number;
	currentRound: number;
	maxPlayers: number;
	gameStatus: GameStatus;
}
