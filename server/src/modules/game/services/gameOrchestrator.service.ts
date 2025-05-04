import { inject, injectable } from 'inversify';
import { InitGameDTO } from '../dto/initGame.dto';
import { GameModel } from '../models/game.model';
import { PlayerModel } from '../models/player.model';
import TYPES from '../../../IoC-types';
import { IPlayerService } from './player/player.service.interface';
import { Game } from '../entities/game/game.entity';
import { IPlayerRepository } from '../redis-repository/player/player.repository.interface';
import { IGameService } from './game/game.service.interface';
import { Player } from '../entities/player/player.entity';
import { AppError } from '../../../shared/errors/app/app.error';
import { JoinGameDTO } from '../dto/joinGame.dto';
import { StartGameDTO } from '../dto/startGame.dto';
import { IGameRepository } from '../redis-repository/game/game.repository.interface';
import { IGameOrhestrator } from './gameOrchestrator.service.interface';
import { PlayerQuestions, Round } from '../entities/round.entity';
import { IRoundService } from './round/round.service.interface';
import { AnswerQuestionDTO } from '../dto/answerQuestion.dto';
import { IRoundRepository } from '../redis-repository/round/round.repository.interface';
import { Answer } from '../entities/answer.entity';
import { RequestQuestionForVotingDTO } from '../dto/requestQuestion.dto';
import { AnswerModel } from '../models/answer.model';
import { QuestionModel } from '../models/question.model';

@injectable()
export class GameOrchestrator implements IGameOrhestrator {
	constructor(
		@inject(TYPES.PlayerService) private readonly playerService: IPlayerService,
		@inject(TYPES.PlayerRepository)
		private readonly playerRepository: IPlayerRepository,
		@inject(TYPES.GameService) private readonly gameService: IGameService,
		@inject(TYPES.GameRepository) private readonly gameRepository: IGameRepository,
		@inject(TYPES.RoundService) private readonly roundService: IRoundService,
		@inject(TYPES.RoundRepository) private readonly roundRepository: IRoundRepository,
	) {}

	async initGame({
		playerName,
	}: InitGameDTO): Promise<[GameModel, PlayerModel | null]> {
		const game = Game.createNew();

		const vipModel = await this.playerService.createVIPPlayer(
			game.gameCode,
			playerName,
		);
		game.addOnePlayer();

		const gameModel = await this.gameRepository.setGame(game);

		return [gameModel, vipModel];
	}

	async addPlayer({
		gameCode,
		playerName,
	}: JoinGameDTO): Promise<[PlayerModel, PlayerModel[]]> {
		const isPlayerExists = await this.playerService.checkNameExisting(
			gameCode,
			playerName,
		);
		if (isPlayerExists) {
			throw new AppError('Player with this name is already exists');
		}

		const newPlayer = Player.createNew(playerName);

		await this.gameService.addPlayerToGame(gameCode);

		const playerModel = await this.playerRepository.setPlayer(gameCode, newPlayer);
		const players = (await this.playerRepository.getPlayers(
			gameCode,
		)) as PlayerModel[];

		const vip = (await this.playerRepository.getVIPPlayer(gameCode)) as PlayerModel;

		return [playerModel, [vip, ...players]];
	}

	async startGame({
		gameCode,
	}: StartGameDTO): Promise<[GameModel, PlayerModel[], PlayerQuestions[], string]> {
		const game = await this.gameService.getGameInstanceFromDB(gameCode);
		game.startGame();
		const gameModel = await this.gameRepository.setGame(game);
		const players = (await this.playerRepository.getPlayers(
			game.gameCode,
		)) as PlayerModel[];
		const VIPModel = (await this.playerRepository.getVIPPlayer(
			game.gameCode,
		)) as PlayerModel;
		players.unshift(VIPModel);

		const [questions, roundId] = await this.startRound(gameCode);
		return [gameModel, players, questions, roundId];
	}

	async startRound(gameCode: string): Promise<[PlayerQuestions[], string]> {
		const players =
			await this.playerService.getPlayerInstancesWithVIPFromDB(gameCode);
		const questions = await this.roundService.getQuestionInstancesFromDB(
			players.length,
		);
		const round = Round.createNew(players, questions);
		await this.roundRepository.setRound(gameCode, round);
		return [round.distributeQuestions(), round.roundId];
	}

	async registerAnswer({
		answer,
		gameCode,
		playerName,
		questionId,
		roundId,
	}: AnswerQuestionDTO): Promise<void> {
		const players =
			await this.playerService.getPlayerInstancesWithVIPFromDB(gameCode);
		const round = await this.roundService.getRoundInstanceFromDB(
			gameCode,
			roundId,
			players,
		);

		const answerInstance = Answer.createNew(playerName, answer, questionId);
		const isDublicatedAnswer = this.isAnswerDublicates(
			round,
			answer,
			questionId,
			playerName,
		);
		if (isDublicatedAnswer) {
			throw new AppError('Answers Dublication');
		}
		round.answers.push(answerInstance);

		await this.roundRepository.setRound(gameCode, round);
	}

	async getQuestionWithAnswers({
		gameCode,
		questionId,
		roundId,
	}: RequestQuestionForVotingDTO): Promise<
		[QuestionModel, [AnswerModel, AnswerModel]]
	> {
		const question = await this.roundRepository.getQuestionById(
			gameCode,
			roundId,
			questionId,
		);
		if (!question) {
			throw new AppError(
				'Question with this id and gameCode is not found in redis',
			);
		}

		const answers = await this.roundRepository.getAnswersByQuestionId(
			gameCode,
			roundId,
			questionId,
		);
		if (!answers) {
			throw new AppError(
				'Answers with this questionId and gameCode are not found in redis',
			);
		}

		return [question, [answers[0], answers[1]]];
	}

	private isAnswerDublicates(
		round: Round,
		answer: string,
		questionId: number,
		playerName: string,
	): boolean {
		const isAnswerDub = round.answers.some((a) => a.answer == answer);
		const isQuestionIdDub = round.answers.some((a) => a.questionId == questionId);
		const isPlayerNameDub = round.answers.some((a) => a.playerName == playerName);

		return isAnswerDub && isPlayerNameDub && isQuestionIdDub;
	}
}
