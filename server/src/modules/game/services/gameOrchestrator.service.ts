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
import { PlayerQuestions, Round, VotingResult } from '../entities/round.entity';
import { IRoundService } from './round/round.service.interface';
import { AnswerQuestionDTO } from '../dto/answerQuestion.dto';
import { IRoundRepository } from '../redis-repository/round/round.repository.interface';
import { Answer } from '../entities/answer.entity';
import { RequestQuestionForVotingDTO } from '../dto/requestQuestion.dto';
import { AnswerModel } from '../models/answer.model';
import { QuestionModel } from '../models/question.model';
import { VotingDTO } from '../dto/voting.dto';
import { Vote } from '../entities/vote.entity';
import { VoteModel } from '../models/vote.model';
import { CalcAnswerPointsDTO } from '../dto/calcPoints.dto';
import { ILoggerService } from '../../../shared/logger/logger.service.interface';

@injectable()
export class GameOrchestrator implements IGameOrhestrator {
	constructor(
		@inject(TYPES.LoggerService) private readonly logger: ILoggerService,
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
		try {
			const newPlayer = Player.createNew(playerName);

			const gameModel = await this.gameService.addPlayerToGame(gameCode);
			newPlayer.avatarNumber = gameModel.currentPlayers;

			const playerModel = await this.playerRepository.setPlayer(
				gameCode,
				newPlayer,
			);
			const players = (await this.playerRepository.getPlayers(
				gameCode,
			)) as PlayerModel[];
			const vip = (await this.playerRepository.getVIPPlayer(
				gameCode,
			)) as PlayerModel;

			return [playerModel, [vip, ...players]];
		} catch (error) {
			throw error;
		}
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

		return [question, [answers[0] || {}, answers[1] || {}]];
	}

	async voteForAnswer({
		answerId,
		gameCode,
		playerName,
		roundId,
	}: VotingDTO): Promise<VoteModel[]> {
		const vote = Vote.createNew(playerName, answerId);

		const players =
			await this.playerService.getPlayerInstancesWithVIPFromDB(gameCode);

		const round = await this.roundService.getRoundInstanceFromDB(
			gameCode,
			roundId,
			players,
		);

		const isAnswerExists = round.answers.some((a) => a.answerId == answerId);

		if (!isAnswerExists) {
			throw new AppError(`Answer with id ${answerId} doesn't exist`);
		}

		if (this.isDublicatedVote(round.votes, vote)) {
			throw new AppError('Trying to add existing vote');
		}

		const answer = await this.roundRepository.getAnswerById(
			gameCode,
			roundId,
			answerId,
		);

		// if (playerName == answer?.playerName) {
		// 	throw new AppError('You can not vote for your answer');
		// }

		round.votes.push(vote);

		await this.roundRepository.setRound(gameCode, round);

		const voteModels: VoteModel[] = round.votes.map((v) => ({
			voteId: v.voteId,
			answerId: v.answerId,
			playerName: v.playerName,
		}));

		return voteModels;
	}

	async calcAnswerPoints({
		gameCode,
		answerId1,
		answerId2,
		roundId,
	}: CalcAnswerPointsDTO): Promise<[VotingResult, PlayerModel, PlayerModel]> {
		let votes1: Vote[] = [];
		let votes2: Vote[] = [];

		try {
			votes1 = await this.roundService.getVotesInstancesFromDB(
				gameCode,
				roundId,
				answerId1,
			);
		} catch (error) {
			this.logger.info(`Votes for answer ${answerId1} are not found`, this);
		}

		try {
			votes2 = await this.roundService.getVotesInstancesFromDB(
				gameCode,
				roundId,
				answerId2,
			);
		} catch (error) {
			this.logger.info(`Votes for answer ${answerId2} are not found`, this);
		}

		const answer1 = await this.roundService.getAnswerInstanceFromDB(
			gameCode,
			roundId,
			answerId1,
		);
		const answer2 = await this.roundService.getAnswerInstanceFromDB(
			gameCode,
			roundId,
			answerId2,
		);

		const roundNumber = (await this.gameRepository.getGame(gameCode))!.currentRound;

		const points = Round.calcPoints(
			answer1,
			answer2,
			votes1.length,
			votes2.length,
			roundNumber,
		);

		const player1 = await this.playerService.updatePlayerScore(
			gameCode,
			answer1.playerName,
			points.answer1.points,
		);
		const player2 = await this.playerService.updatePlayerScore(
			gameCode,
			answer2.playerName,
			points.answer2.points,
		);

		return [points, player1, player2];
	}

	private isAnswerDublicates(
		round: Round,
		answer: string,
		questionId: number,
		playerName: string,
	): boolean {
		const isAnswerDub = round.answers.some(
			(a) =>
				a.answer == answer &&
				a.playerName == playerName &&
				a.questionId == questionId,
		);

		return isAnswerDub;
	}

	private isDublicatedVote(votes: Vote[], v: Vote): boolean {
		return votes.some(
			(vote) => vote.answerId == v.answerId && vote.playerName == v.playerName,
		);
	}
}
