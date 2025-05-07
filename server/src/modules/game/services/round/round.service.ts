import { inject, injectable } from 'inversify';
import { Question } from '../../entities/question.entity';
import { IRoundService } from './round.service.interface';
import TYPES from '../../../../IoC-types';
import { IQuestionRepository } from '../../repository/question.repository.interface';
import { AppError } from '../../../../shared/errors/app/app.error';
import { Round } from '../../entities/round.entity';
import { IRoundRepository } from '../../redis-repository/round/round.repository.interface';
import { Answer } from '../../entities/answer.entity';
import { Vote } from '../../entities/vote.entity';
import { Player } from '../../entities/player/player.entity';

@injectable()
export class RoundService implements IRoundService {
	constructor(
		@inject(TYPES.QuestionRepository)
		private readonly questionRepository: IQuestionRepository,
		@inject(TYPES.RoundRepository) private readonly roundRepository: IRoundRepository,
	) {}

	async getQuestionInstancesFromDB(number: number): Promise<Question[]> {
		const questionModels = await this.questionRepository.getQuestions(number);
		if (!questionModels) {
			throw new AppError('Questions are empty in redis');
		}

		return questionModels.map((q) => new Question(q.id, q.text));
	}

	async getRoundInstanceFromDB(
		gameCode: string,
		roundId: string,
		players: Player[],
	): Promise<Round> {
		const data = await this.roundRepository.getRound(gameCode, roundId);
		if (!data) {
			throw new AppError('Round is empty in redis');
		}
		const questions = data.questions.map((q) => new Question(q.questionId, q.text));
		const answers = data.answers?.map((a) =>
			Answer.restore(a.answerId, a.playerName, a.answer, a.questionId),
		);
		const votes = data.votes?.map((v) =>
			Vote.restore(v.voteId, v.playerName, v.answerId),
		);

		const round = Round.restore(data.roundId, players, questions, votes, answers);
		return round;
	}

	async getVotesInstancesFromDB(
		gameCode: string,
		roundId: string,
		answerId: string,
	): Promise<Vote[]> {
		const voteModels = await this.roundRepository.getVotesByAnswerId(
			gameCode,
			roundId,
			answerId,
		);
		if (!voteModels) {
			throw new AppError('Votes are empty in redis');
		}

		return voteModels.map((v) => Vote.restore(v.voteId, v.playerName, v.answerId));
	}

	async getAnswerInstanceFromDB(
		gameCode: string,
		roundId: string,
		answerId: string,
	): Promise<Answer> {
		const answerModel = await this.roundRepository.getAnswerById(
			gameCode,
			roundId,
			answerId,
		);

		if (!answerModel) {
			throw new AppError('Answer is empty in redis');
		}

		return Answer.restore(
			answerModel.answerId,
			answerModel.playerName,
			answerModel.answer,
			answerModel.questionId,
		);
	}
}
