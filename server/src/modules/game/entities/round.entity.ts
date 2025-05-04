import { v4 } from 'uuid';
import { Player } from './player/player.entity';
import { Question } from './question.entity';
import { Vote } from './vote.entity';
import { Answer } from './answer.entity';

export type PlayerQuestions = {
	playerId: string;
	question1: { questionId: number; text: string };
	question2: { questionId: number; text: string };
};

export class Round {
	private constructor(
		private _roundId: string,
		public players: Player[],
		public questions: Question[],
		public votes: Vote[] = [],
		public answers: Answer[] = [],
	) {}

	static createNew(players: Player[], questions: Question[]): Round {
		return new Round(v4(), players, questions);
	}

	static restore(
		roundId: string,
		players: Player[],
		questions: Question[],
		votes: Vote[],
		answers: Answer[],
	): Round {
		return new Round(roundId, players, questions, votes, answers);
	}

	get roundId(): typeof this._roundId {
		return this._roundId;
	}

	distributeQuestions(): PlayerQuestions[] {
		const playersQuestions: PlayerQuestions[] = [];

		const randomOffset = Math.floor(Math.random() * (this.players.length - 1)) + 1;

		this.players.forEach((player, index) => {
			const question1 = this.questions[index];
			const question2 =
				this.questions[(index + randomOffset) % this.players.length];

			playersQuestions.push({
				playerId: player.playerId,
				question1: {
					questionId: question1.questionId,
					text: question1.text,
				},
				question2: { questionId: question2.questionId, text: question2.text },
			});
		});
		return playersQuestions;
	}
}
