import { question } from '@prisma/client';

export interface IQuestionRepository {
	getQuestions(number: number): Promise<question[] | null>;
}
