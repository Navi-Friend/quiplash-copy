import { v4 as uuid4 } from 'uuid';
import { IPlayer } from './player.entity.interface';
import { AppError } from '../../../../shared/errors/app/app.error';

export class Player implements IPlayer {
	private _playerId: string;
	private _name: string;
	private _points: number = 0;

	constructor(name: string) {
		this._playerId = uuid4();
		this._name = name;
	}

	get name(): string {
		return this._name;
	}

	get playerId(): string {
		return this._playerId;
	}

	get points(): number {
		return this._points;
	}

	set points(points: number) {
		if (points > 0) {
			this._points = points;
		} else {
			throw new AppError('Player points should be > 0');
		}
	}
}
