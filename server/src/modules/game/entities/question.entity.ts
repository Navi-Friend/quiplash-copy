export class Question {
	constructor(
		private _questionId: number,
		private _text: string,
	) {}

	get text(): string {
		return this._text;
	}

	get questionId(): number {
		return this._questionId;
	}
}
