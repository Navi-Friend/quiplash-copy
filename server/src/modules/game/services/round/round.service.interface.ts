import { Player } from '../../entities/player/player.entity';
import { Question } from '../../entities/question.entity';
import { Round } from '../../entities/round.entity';

export interface IRoundService {
	getQuestionInstancesFromDB(number: number): Promise<Question[]>;
	getRoundInstanceFromDB(
		gameCode: string,
		roundId: string,
		players: Player[],
	): Promise<Round>;
}
