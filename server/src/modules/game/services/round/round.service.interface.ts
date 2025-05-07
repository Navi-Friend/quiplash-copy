import { Answer } from '../../entities/answer.entity';
import { Player } from '../../entities/player/player.entity';
import { Question } from '../../entities/question.entity';
import { Round } from '../../entities/round.entity';
import { Vote } from '../../entities/vote.entity';

export interface IRoundService {
	getQuestionInstancesFromDB(number: number): Promise<Question[]>;
	getRoundInstanceFromDB(
		gameCode: string,
		roundId: string,
		players: Player[],
	): Promise<Round>;
	getVotesInstancesFromDB(
		gameCode: string,
		roundId: string,
		answerId: string,
	): Promise<Vote[]>;
	getAnswerInstanceFromDB(
		gameCode: string,
		roundId: string,
		answerId: string,
	): Promise<Answer>;
}
