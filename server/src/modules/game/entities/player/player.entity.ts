import { v4 as uuid4 } from 'uuid';
import { IPlayer } from './player.entity.interface';
import { AppError } from '../../../../shared/errors/app/app.error';

export class Player implements IPlayer {
	private _playerId: string;
	private _name: string;
	private _score: number;

	constructor(name: string) {
		this._playerId = uuid4();
		this._name = name;
		this._score = 0;
	}

	get name(): string {
		return this._name;
	}

	get playerId(): string {
		return this._playerId;
	}

	get score(): number {
		return this._score;
	}

	set score(score: number) {
		if (score > 0) {
			this._score = score;
		} else {
			throw new AppError('Player score should be > 0');
		}
	}
}
