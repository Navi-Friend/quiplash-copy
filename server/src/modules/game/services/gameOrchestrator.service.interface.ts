import { AnswerQuestionDTO } from '../dto/answerQuestion.dto';
import { CalcAnswerPointsDTO } from '../dto/calcPoints.dto';
import { InitGameDTO } from '../dto/initGame.dto';
import { JoinGameDTO } from '../dto/joinGame.dto';
import { RequestQuestionForVotingDTO } from '../dto/requestQuestion.dto';
import { StartGameDTO } from '../dto/startGame.dto';
import { VotingDTO } from '../dto/voting.dto';
import { PlayerQuestions, VotingResult } from '../entities/round.entity';
import { AnswerModel } from '../models/answer.model';
import { GameModel } from '../models/game.model';
import { PlayerModel } from '../models/player.model';
import { QuestionModel } from '../models/question.model';
import { VoteModel } from '../models/vote.model';

export interface IGameOrhestrator {
	initGame(data: InitGameDTO): Promise<[GameModel, PlayerModel | null]>;
	addPlayer(data: JoinGameDTO): Promise<[PlayerModel, PlayerModel[]]>;
	startGame(
		data: StartGameDTO,
	): Promise<[GameModel, PlayerModel[], PlayerQuestions[], string]>;
	startRound(gameCode: string): Promise<[PlayerQuestions[], string]>;
	registerAnswer(data: AnswerQuestionDTO): Promise<void>;
	getQuestionWithAnswers(
		data: RequestQuestionForVotingDTO,
	): Promise<[QuestionModel, [AnswerModel, AnswerModel]]>;
	voteForAnswer(data: VotingDTO): Promise<VoteModel[]>;
	calcAnswerPoints(
		data: CalcAnswerPointsDTO,
	): Promise<[VotingResult, PlayerModel, PlayerModel]>;
}
