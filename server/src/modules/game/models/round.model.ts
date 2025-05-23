import { AnswerModel } from './answer.model';
import { QuestionModel } from './question.model';
import { VoteModel } from './vote.model';

export interface RoundModel {
	roundId: string;
	questions: QuestionModel[];
	answers: AnswerModel[];
	votes: VoteModel[];
}
