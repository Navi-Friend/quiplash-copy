import { inject, injectable } from 'inversify';
import { IQuestionRepository } from './question.repository.interface';
import TYPES from '../../../IoC-types';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { question } from '@prisma/client';

@injectable()
export class QuestionRepository implements IQuestionRepository {
	constructor(@inject(TYPES.PrismaService) private readonly prisma: PrismaService) {}

	async getQuestions(number: number): Promise<question[] | null> {
		return this.prisma.client.question.findMany({
			take: number,
		});
	}
}
