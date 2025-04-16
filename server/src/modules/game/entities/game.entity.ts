import { v4 as uuidv4 } from 'uuid';
import VIPPlayer from './player/VIPPlayer.entity';

export default class Game {
	private _gameId: string;
	private _VIPPlayer: VIPPlayer;
	private _roomCode: string;

	rounds: Round[];
	currentRound: Round;
	players: Player[];
	spectators?: Spectator[];

	constructor(vip: VIPPlayer) {
		this._roomCode = this.generateCode();
		this._gameId = uuidv4();
		this._VIPPlayer = vip;
	}

	private generateCode() {
		return Math.random().toString(36).substring(2, 6).toUpperCase();
	}

	get roomCode() {
		return this._roomCode;
	}

	get gameId() {
		return this._gameId;
	}

	get VIPPlayer() {
		return this._VIPPlayer;
	}
}
