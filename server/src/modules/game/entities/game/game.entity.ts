import { v4 as uuidv4 } from 'uuid';
import { VIPPlayer } from '../player/VIPPlayer.entity';
import { MAX_ACTIVE_PLAYERS, ROUNDS_NUMBER } from '../../constants';
import { AppError } from '../../../../shared/errors/app/app.error';
import { Player } from '../player/player.entity';
import { Spectator } from '../player/spectator.entity';
import { GameStatus } from './gameStatus';

export class Game {
	private _gameId: string;
	private _VIPPlayer: VIPPlayer | undefined;
	private _gameCode: string;
	gameStatus: GameStatus = GameStatus.not_started;

	totalRounds: number = ROUNDS_NUMBER;
	currentRound: number;
	players?: Player[];
	maxPlayers: number = MAX_ACTIVE_PLAYERS;
	spectators?: Spectator[];

	constructor() {
		this._gameCode = this.generateGameCode();
		this._gameId = uuidv4();
		this.currentRound = 0;
	}

	private generateGameCode(): string {
		return Math.random().toString(36).substring(2, 6).toUpperCase();
	}

	get gameCode(): string {
		return this._gameCode;
	}

	get gameId(): string {
		return this._gameId;
	}

	get VIPPlayer(): VIPPlayer | undefined {
		return this._VIPPlayer;
	}

	set VIPPlayer(vip: VIPPlayer) {
		if (!this._VIPPlayer) {
			this._VIPPlayer = vip;
			this.gameStatus = GameStatus.wait_players;
		} else {
			throw new AppError('VIP Player has already set');
		}
	}
}
