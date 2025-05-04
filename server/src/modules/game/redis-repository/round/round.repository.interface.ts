import { Round } from '../../entities/round.entity';
import { AnswerModel } from '../../models/answer.model';
import { QuestionModel } from '../../models/question.model';
import { RoundModel } from '../../models/round.model';

export interface IRoundRepository {
	setRound(gameCode: string, round: Round): Promise<RoundModel>;
	getRound(gameCode: string, roudId: string): Promise<RoundModel | null>;
	getQuestionById(
		gameCode: string,
		roundId: string,
		questionId: number,
	): Promise<QuestionModel | null>;
	getAnswersByQuestionId(
		gameCode: string,
		roundId: string,
		questionId: number,
	): Promise<AnswerModel[] | null>;
}
