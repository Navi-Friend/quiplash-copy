import { Answer } from './answer.entity';

export class Vote {
	constructor(
		private _voteId: string,
		private _playerId: string,
		private _answer: Answer,
	) {}

	getAnswer(playerId: string, answer: Answer): void {
		this._answer = answer;
		this._playerId = playerId;
	}

	get voteId(): string {
		return this._voteId;
	}

	get playerId(): string {
		return this.playerId;
	}

	get answer(): Answer {
		return this._answer;
	}
}
