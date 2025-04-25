import { v4 } from 'uuid';
import { PlayerModel } from '../../models/player.model';
import { AppError } from '../../../../shared/errors/app/app.error';

export class BasePlayer {
	constructor(
		private _name: string,
		private _playerId: string,
		private _score: number = 0,
	) {}

	static createNew<T extends BasePlayer>(
		this: new (name: string, playerId: string, score?: number) => T,
		name: string,
	): T {
		return new this(name, v4());
	}

	static restore<T extends BasePlayer>(
		this: new (name: string, playerId: string, score?: number) => T,
		data: PlayerModel,
	): T {
		return new this(data.name, data.playerId, data.score);
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
