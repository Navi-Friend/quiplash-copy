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

	static calcPoints(
		answer1: Answer,
		answer2: Answer,
		votes1: number,
		votes2: number,
		roundNumber: number,
	): VotingResult {
		const answer1Text = answer1.answer.trim().toLowerCase();
		const answer2Text = answer2.answer.trim().toLowerCase();

		console.log(answer1, answer2, votes1, votes2, roundNumber);
		if (answer1Text === answer2Text) {
			return {
				answer1: { answerId: answer1.answerId, points: 0 },
				answer2: { answerId: answer2.answerId, points: 0 },
				extra: 'mess',
			};
		}

		if (!answer1Text) {
			return {
				answer1: { answerId: answer1.answerId, points: 0 },
				answer2: {
					answerId: answer2.answerId,
					points: 1000 * roundNumber + 100 * roundNumber,
				},
				extra: null,
			};
		}

		if (!answer2Text) {
			return {
				answer1: {
					answerId: answer1.answerId,
					points: 1000 * roundNumber + 100 * roundNumber,
				},
				answer2: { answerId: answer2.answerId, points: 0 },
				extra: null,
			};
		}
		const answer1Percentage = Math.round(votes1 / (votes1 + votes2)) * 100;
		const answer2Percentage = Math.round(votes2 / (votes1 + votes2)) * 100;

		if (answer1Percentage == 100) {
			return {
				answer1: {
					answerId: answer1.answerId,
					points: (1000 + 100 + 250) * roundNumber,
				},
				answer2: { answerId: answer2.answerId, points: 0 },
				extra: 'quiplash',
			};
		}

		if (answer2Percentage == 100) {
			return {
				answer1: {
					answerId: answer1.answerId,
					points: 0,
				},
				answer2: {
					answerId: answer2.answerId,
					points: (1000 + 100 + 250) * roundNumber,
				},
				extra: 'quiplash',
			};
		}

		return {
			answer1: {
				answerId: answer1.answerId,
				points:
					answer1Percentage > answer2Percentage
						? (answer1Percentage * 10 + 100) * roundNumber
						: answer1Percentage * 10 * roundNumber,
			},
			answer2: {
				answerId: answer2.answerId,
				points:
					answer2Percentage > answer1Percentage
						? (answer2Percentage * 10 + 100) * roundNumber
						: answer2Percentage * 10 * roundNumber,
			},
			extra: null,
		};
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

export interface VotingResult {
	answer1: { answerId: string; points: number };
	answer2: { answerId: string; points: number };
	extra: 'mess' | 'quiplash' | null;
}
