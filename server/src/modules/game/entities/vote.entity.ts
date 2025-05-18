import { v4 } from 'uuid';

export class Vote {
	private constructor(
		private _voteId: string,
		private _playerName: string,
		private _answerId: string,
	) {}

	static createNew(playerName: string, answerId: string): Vote {
		return new Vote(v4(), playerName, answerId);
	}

	static restore(voteId: string, playerName: string, answerId: string): Vote {
		return new Vote(voteId, playerName, answerId);
	}

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
