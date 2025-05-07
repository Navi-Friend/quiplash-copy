import { MAX_ACTIVE_PLAYERS, ROUNDS_NUMBER } from '../../constants';
import { AppError } from '../../../../shared/errors/app/app.error';
import { GameStatus } from './gameStatus';
import { GameModel } from '../../models/game.model';

export class Game implements GameModel {
	private constructor(
		private _gameCode: string,
		public gameStatus: GameStatus = GameStatus.not_started,
		private _totalRounds: number = ROUNDS_NUMBER,
		private _currentRound: number = 0,
		private _maxPlayers: number = MAX_ACTIVE_PLAYERS,
		private _currentPlayers: number = 0,
		private _spectators: number = 0,
	) {}

	static createNew(): Game {
		const gameCode = this.generateGameCode();
		return new Game(gameCode);
	}

	static restore(data: GameModel): Game {
		return new Game(
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
		if (
			this._currentPlayers + 1 <= this._maxPlayers &&
			(this.gameStatus == GameStatus.wait_players ||
				this.gameStatus == GameStatus.not_started)
		) {
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

	nextRound(): void {
		this._currentRound += 1;
	}

	startGame(): void {
		if (this._currentPlayers >= 3) {
			this.gameStatus = GameStatus.start_game;
			this.nextRound();
		} else {
			throw new AppError("Game can't be started with less than 3 players");
		}
	}
}
