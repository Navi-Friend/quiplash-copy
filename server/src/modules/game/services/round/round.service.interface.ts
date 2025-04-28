import { Question } from '../../entities/question.entity';

export interface IRoundService {
	getQuestionInstancesFromDB(number: number): Promise<Question[]>;
}
