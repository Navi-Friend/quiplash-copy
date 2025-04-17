import { v4 as uuidv4 } from 'uuid';
import VIPPlayer from './player/VIPPlayer.entity';
import { MAX_ACTIVE_PLAYERS, ROUNDS_NUMBER } from '../constants';

export default class Game {
	private _gameId: string;
	private _VIPPlayer: VIPPlayer;
	private _roomCode: string;

	rounds: Round[] = ROUNDS_NUMBER;
	currentRound: Round;
	players: Player[];
	maxPlayers: number = MAX_ACTIVE_PLAYERS;
	spectators?: Spectator[];

	constructor(vip: VIPPlayer) {
		this._roomCode = this.generateCode();
		this._gameId = uuidv4();
		this._VIPPlayer = vip;
	}

	private generateCode(): string {
		return Math.random().toString(36).substring(2, 6).toUpperCase();
	}

	get roomCode(): string {
		return this._roomCode;
	}

	get gameId(): string {
		return this._gameId;
	}

	get VIPPlayer(): VIPPlayer {
		return this._VIPPlayer;
	}
}
