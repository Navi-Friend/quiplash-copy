import { AnswerQuestionDTO } from '../dto/answerQuestion.dto';
import { InitGameDTO } from '../dto/initGame.dto';
import { JoinGameDTO } from '../dto/joinGame.dto';
import { StartGameDTO } from '../dto/startGame.dto';
import { PlayerQuestions } from '../entities/round.entity';
import { GameModel } from '../models/game.model';
import { PlayerModel } from '../models/player.model';

export interface IGameOrhestrator {
	initGame(data: InitGameDTO): Promise<[GameModel, PlayerModel | null]>;
	addPlayer(data: JoinGameDTO): Promise<[PlayerModel, PlayerModel[]]>;
	startGame(data: StartGameDTO): Promise<[GameModel, PlayerModel[], PlayerQuestions[]]>;
	startRound(gameCode: string): Promise<PlayerQuestions[]>;
	registerAnswer(data: AnswerQuestionDTO): Promise<void>;
}
