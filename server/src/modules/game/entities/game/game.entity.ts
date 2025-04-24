import { MAX_ACTIVE_PLAYERS, ROUNDS_NUMBER } from '../../constants';
import { AppError } from '../../../../shared/errors/app/app.error';
import { GameStatus } from './gameStatus';
import { GameModel } from '../../models/game.model';

export class Game implements GameModel {
	// private _gameId: string;
	// private _VIPPlayer: VIPPlayer | undefined;
	// private _gameCode: string;
	// gameStatus: GameStatus = GameStatus.not_started;

	// totalRounds: number = ROUNDS_NUMBER;
	// currentRound: number;
	// maxPlayers: number = MAX_ACTIVE_PLAYERS;
	// currentPlayers: number = 0;
	// spectators: number = 0;

	private constructor(
		private _gameCode: string,
		public gameStatus: GameStatus = GameStatus.not_started,
		private _totalRounds: number = ROUNDS_NUMBER,
		private _currentRound: number = 0,
		private _maxPlayers: number = MAX_ACTIVE_PLAYERS,
		private _currentPlayers: number = 0,
		private _spectators: number = 0,
		// VIPPlayer?: VIPPlayer,
	) {}

	static createNew(): Game {
		const gameCode = this.generateGameCode();
		// const gameId = uuidv4();
		return new Game(gameCode);
	}

	static restore(data: GameModel): Game {
		return new Game(
			// data.gameId,
			data.gameCode,
			data.gameStatus,
			data.totalRounds,
			data.currentRound,
			data.maxPlayers,
			data.currentPlayers,
			data.spectators,
		);
	}

	private static generateGameCode(): string {
		return Math.random().toString(36).substring(2, 6).toUpperCase();
	}

	get gameCode(): typeof this._gameCode {
		return this._gameCode;
	}

	get totalRounds(): typeof this._totalRounds {
		return this._totalRounds;
	}

	get currentRound(): typeof this._currentRound {
		return this._currentRound;
	}

	// set currentRound(round: number) {
	// 	if (round <= this.totalRounds) {
	// 		this._currentRound = round;
	// 	}
	// }

	get maxPlayers(): typeof this._maxPlayers {
		return this._maxPlayers;
	}

	get currentPlayers(): typeof this._currentPlayers {
		return this._currentPlayers;
	}

	get spectators(): typeof this._spectators {
		return this._spectators;
	}

	addOnePlayer(): void {
		if (this._currentPlayers + 1 <= this._maxPlayers) {
			if (this.currentPlayers == 0) {
				this.gameStatus = GameStatus.wait_players;
			}
			this._currentPlayers++;
		} else {
			throw new AppError('Game is full of players');
		}
	}

	addOneSpectator(): void {
		this._spectators++;
	}

	startFirstRound(): void {
		this._currentRound = 1;
	}

	startSecondRound(): void {
		this._currentRound = 2;
	}

	startThirdRound(): void {
		this._currentRound = 3;
	}

	// get VIPPlayer(): VIPPlayer | undefined {
	// 	return this._VIPPlayer;
	// }

	// set VIPPlayer(vip: VIPPlayer) {
	// 	if (!this._VIPPlayer) {
	// 		this._VIPPlayer = vip;
	// 		this.gameStatus = GameStatus.wait_players;
	// 	} else {
	// 		throw new AppError('VIP Player has already set');
	// 	}
	// }

	// addPlayer(): void {
	// 	if (this.currentPlayers != this.maxPlayers) {
	// 		this.currentPlayers += 1;
	// 	} else {
	// 		throw new AppError('Max number of active players have been achieved');
	// 	}
	// }
}
