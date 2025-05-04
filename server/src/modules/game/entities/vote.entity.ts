import { Answer } from './answer.entity';

export class Vote {
	constructor(
		private _voteId: string,
		private _playerName: string,
		private _answerId: string,
	) {}

	// getAnswer(playerId: string, answerId: string): void {
	// 	this._answer = answer;
	// 	this._playerId = playerId;
	// }

	get voteId(): string {
		return this._voteId;
	}

	get playerName(): string {
		return this._playerName;
	}

	get answerId(): string {
		return this._answerId;
	}
}
