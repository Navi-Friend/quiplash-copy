import { v4 } from 'uuid';

export class Answer {
	private constructor(
		private _answerId: string,
		private _playerName: string,
		private _answer: string,
		private _questionId: number,
	) {}

	static createNew(playerName: string, answer: string, questionId: number): Answer {
		return new Answer(v4(), playerName, answer, questionId);
	}

	static restore(
		answerId: string,
		playerName: string,
		answer: string,
		questionId: number,
	): Answer {
		return new Answer(answerId, playerName, answer, questionId);
	}

	get answerId(): string {
		return this._answerId;
	}

	get playerName(): string {
		return this._playerName;
	}

	get answer(): string {
		return this._answer;
	}

	get questionId(): number {
		return this._questionId;
	}
}
