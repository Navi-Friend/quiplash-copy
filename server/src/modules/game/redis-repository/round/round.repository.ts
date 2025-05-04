import { inject, injectable } from 'inversify';
import { BaseRedisRepository } from '../../../../shared/redis/base.repository';
import { Round } from '../../entities/round.entity';
import { RoundModel } from '../../models/round.model';
import { IRoundRepository } from './round.repository.interface';
import TYPES from '../../../../IoC-types';
import { RedisService } from '../../../../shared/redis/redis.service';
import { RedisJSON } from '@redis/json/dist/commands';
import { ILoggerService } from '../../../../shared/logger/logger.service.interface';
import { AppError } from '../../../../shared/errors/app/app.error';
import { AnswerModel } from '../../models/answer.model';
import { QuestionModel } from '../../models/question.model';

@injectable()
export class RoundRepository extends BaseRedisRepository implements IRoundRepository {
	constructor(
		@inject(TYPES.RedisService) private readonly redisService: RedisService,
		@inject(TYPES.LoggerService) private readonly logger: ILoggerService,
	) {
		super();
	}

	async setRound(gameCode: string, round: Round): Promise<RoundModel> {
		try {
			const roundModel: RoundModel = {
				roundId: round.roundId,
				questions: round.questions.map((question) => ({
					questionId: question.questionId,
					text: question.text,
				})),
				answers:
					round.answers?.map((answer) => ({
						answerId: answer.answerId,
						playerName: answer.playerName,
						answer: answer.answer,
						questionId: answer.questionId,
					})) || [],
				votes:
					round.votes?.map((vote) => ({
						voteId: vote.voteId,
						answerId: vote.answerId,
						playerName: vote.playerName,
					})) || [],
			};

			await this.redisService.redis.json.set(
				`game:${gameCode}:rounds:${roundModel.roundId}`,
				'$',
				roundModel as unknown as RedisJSON,
			);

			this.logger.debug(
				`Round is set to redis, ${JSON.stringify(round, null, 2)}`,
				this,
			);

			return roundModel;
		} catch (error) {
			this.logger.error(`Round is not set to redis, ${error}`, this);
			throw new AppError(`Error while setting Round to redis`, error as Error);
		}
	}

	async getRound(gameCode: string, roundId: string): Promise<RoundModel | null> {
		try {
			const result = await this.redisService.redis.json.get(
				`game:${gameCode}:rounds:${roundId}`,
			);

			this.logger.debug(
				`Round is gotten from redis, ${JSON.stringify(result, null, 2)}`,
				this,
			);

			if (!result) {
				return null;
			}

			return result as unknown as RoundModel;
		} catch (error) {
			this.logger.error(`Round is not gotten from redis, ${error}`, this);
			throw new AppError(`Error while getting Round from redis`, error as Error);
		}
	}

	async getAnswersByQuestionId(
		gameCode: string,
		roundId: string,
		questionId: number,
	): Promise<AnswerModel[] | null> {
		try {
			const result = await this.redisService.redis.json.get(
				`game:${gameCode}:rounds:${roundId}`,
				{ path: `$.answers[?(@.questionId == ${questionId})]` },
			);

			this.logger.debug(
				`Answers are gotten from redis, ${JSON.stringify(result, null, 2)}`,
				this,
			);

			if (!result) {
				return null;
			}

			return result as unknown as AnswerModel[];
		} catch (error) {
			this.logger.error(`Answers are not gotten from redis, ${error}`, this);
			throw new AppError(`Error while getting Answers from redis`, error as Error);
		}
	}

	async getQuestionById(
		gameCode: string,
		roundId: string,
		questionId: number,
	): Promise<QuestionModel | null> {
		try {
			const result = (await this.redisService.redis.json.get(
				`game:${gameCode}:rounds:${roundId}`,
				{ path: `$.questions[?(@.questionId == ${questionId})]` },
			)) as QuestionModel[] | null;

			this.logger.debug(
				`Question is gotten from redis, ${JSON.stringify(result, null, 2)}`,
				this,
			);

			if (!result) {
				return null;
			}

			return result[0] as unknown as QuestionModel;
		} catch (error) {
			this.logger.error(`Question is not gotten from redis, ${error}`, this);
			throw new AppError(`Error while getting Question from redis`, error as Error);
		}
	}
}
