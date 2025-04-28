export class Answer {
	constructor(
		private _answerId: string,
		private _playerId: string,
		private _answer: string,
	) {}

	get answerId(): string {
		return this._answerId;
	}

	get playerId(): string {
		return this.playerId;
	}

	get answer(): string {
		return this._answer;
	}
}
