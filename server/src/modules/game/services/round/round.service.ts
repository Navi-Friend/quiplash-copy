import { inject, injectable } from 'inversify';
import { Question } from '../../entities/question.entity';
import { IRoundService } from './round.service.interface';
import TYPES from '../../../../IoC-types';
import { IQuestionRepository } from '../../repository/question.repository.interface';
import { AppError } from '../../../../shared/errors/app/app.error';

@injectable()
export class RoundService implements IRoundService {
	constructor(
		@inject(TYPES.QuestionRepository)
		private readonly questionRepository: IQuestionRepository,
	) {}

	async getQuestionInstancesFromDB(number: number): Promise<Question[]> {
		const questionModels = await this.questionRepository.getQuestions(number);
		if (!questionModels) {
			throw new AppError('Questions are not gotten from DB');
		}

		return questionModels.map((q) => new Question(q.id, q.text));
	}
}
