import { BasePlayer } from './player.abstract.entity';

export class Player extends BasePlayer {
	// constructor(
	// 	private _name: string,
	// 	private _playerId: string,
	// 	private _score: number = 0,
	// ) {}

	// static createNew(name: string): Player {
	// 	return new Player(name, uuid4());
	// }

	// static restore(data: PlayerModel): Player {
	// 	return new Player(data.name, data.playerId, data.score);
	// }

	// get name(): string {
	// 	return this._name;
	// }

	// get playerId(): string {
	// 	return this._playerId;
	// }

	// get score(): number {
	// 	return this._score;
	// }

	// set score(score: number) {
	// 	if (score > 0) {
	// 		this._score = score;
	// 	} else {
	// 		throw new AppError('Player score should be > 0');
	// 	}
	// }
}
