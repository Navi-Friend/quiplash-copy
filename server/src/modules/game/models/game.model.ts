import { GameStatus } from '../entities/game/gameStatus';

export interface GameModel {
	gameCode: string;
	totalRounds: number;
	currentRound: number;
	maxPlayers: number;
	currentPlayers: number;
	gameStatus: GameStatus;
	spectators: number;
}
