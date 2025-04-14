import { v4 as uuid4 } from 'uuid';
import IPlayer from './player.entity.interface';

export default class Player implements IPlayer {
	private _playerId: string;
	private _name: string;

	constructor(name: string) {
		this._playerId = uuid4();
		this._name = name;
	}

	get name() {
		return this._name;
	}

	get playerId() {
		return this._playerId;
	}
}
