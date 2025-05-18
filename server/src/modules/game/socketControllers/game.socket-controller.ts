import { inject, injectable } from 'inversify';
import { Server, Socket } from 'socket.io';
import { ISocketController } from '../../../shared/socketControllers/socketController.interface';
import TYPES from '../../../IoC-types';
import { InitGameDTO } from '../dto/initGame.dto';
import { EVENTS } from '../events';
import { ValidateMiddleware } from '../middlewares/validation.middleware';
import { ILoggerService } from '../../../shared/logger/logger.service.interface';
import { JoinGameDTO } from '../dto/joinGame.dto';
import { StartGameDTO } from '../dto/startGame.dto';
import { IGameOrhestrator } from '../services/gameOrchestrator.service.interface';
import { TIME_TO_ANSWER, TIME_TO_VOTE, TIMER_ADDING } from '../constants';
import { AnswerQuestionDTO } from '../dto/answerQuestion.dto';
import { RequestQuestionForVotingDTO } from '../dto/requestQuestion.dto';
import { VotingDTO } from '../dto/voting.dto';
import { CalcAnswerPointsDTO } from '../dto/calcPoints.dto';

@injectable()
export class GameSocketController implements ISocketController {
	constructor(
		@inject(TYPES.GameOrchestratorService)
		private readonly mainService: IGameOrhestrator,
		@inject(TYPES.LoggerService) private readonly logger: ILoggerService,
	) {}
	registerHandlers(socket: Socket, io: Server): void {
		socket.on(EVENTS.initGame, (data: InitGameDTO, callback: Function) =>
			this.handleInitGame(socket, io, data, callback),
		);
		socket.on(EVENTS.joinGame, (data: JoinGameDTO, callback: Function) =>
			this.handleJoinGame(socket, io, data, callback),
		);
		socket.on(EVENTS.startGame, (data: StartGameDTO, callback: Function) =>
			this.handleStartGame(socket, io, data, callback),
		);
		socket.on(EVENTS.answerQuestion, (data: AnswerQuestionDTO, callback: Function) =>
			this.handleAnswerQuestion(socket, io, data, callback),
		);
		socket.on(
			EVENTS.requestQuestionForVoting,
			(data: RequestQuestionForVotingDTO, callback: Function) =>
				this.handleRequestQuestionForVoting(socket, io, data, callback),
		);
		socket.on(EVENTS.voteForAnswer, (data: VotingDTO, callback: Function) =>
			this.handleVoting(socket, io, data, callback),
		);
		socket.on(EVENTS.calcVotes, (data: CalcAnswerPointsDTO, callback: Function) =>
			this.handleCalcAnswerPoints(socket, io, data, callback),
		);
	}

	async handleInitGame(
		socket: Socket,
		io: Server,
		data: InitGameDTO,
		callback: Function,
	): Promise<void> {
		const errors = await ValidateMiddleware.validateDTO(InitGameDTO, data);
		if (errors.length) {
			callback({ status: '!OK', errors });
			this.logger.error(`Validation data error: ${errors}`, this);
			return;
		}
		try {
			let [game, vip] = await this.mainService.initGame(data);

			await socket.join(game.gameCode);

			callback({ status: 'OK', data: { game, vip } });
		} catch (error) {
			callback({ status: '!OK', errors: error });
		}
	}

	async handleJoinGame(
		socket: Socket,
		io: Server,
		data: JoinGameDTO,
		callback: Function,
	): Promise<void> {
		const errors = await ValidateMiddleware.validateDTO(JoinGameDTO, data);
		if (errors.length) {
			callback({ status: '!OK', errors });
			this.logger.error(`Validation data error: ${errors}`, this);
			return;
		}
		try {
			const [player, players] = await this.mainService.addPlayer(data);

			await socket.join(data.gameCode);
			callback({ status: 'OK', data: { player } });
			io.in(data.gameCode).emit(EVENTS.playerJoined, { data: players });
		} catch (error) {
			callback({ status: '!OK', errors: error });
		}
	}

	async handleStartGame(
		socket: Socket,
		io: Server,
		data: StartGameDTO,
		callback: Function,
	): Promise<void> {
		const errors = await ValidateMiddleware.validateDTO(StartGameDTO, data);
		if (errors.length) {
			callback({ status: '!OK', errors });
			this.logger.error(`Validation data error: ${errors}`, this);
			return;
		}
		try {
			const [gameModel, playerModels, questoins, roundId] =
				await this.mainService.startGame(data);

			const startTime = Date.now() + TIMER_ADDING;

			callback({ status: 'OK', data: { gameModel } });
			io.to(data.gameCode).emit(EVENTS.gameStarted, {
				data: {
					game: gameModel,
					players: playerModels,
					questoins,
					startTime,
					roundId,
					duration: TIME_TO_ANSWER,
				},
			});
		} catch (error) {
			callback({ status: '!OK', errors: error });
		}
	}

	async handleAnswerQuestion(
		socket: Socket,
		io: Server,
		data: AnswerQuestionDTO,
		callback: Function,
	): Promise<void> {
		const errors = await ValidateMiddleware.validateDTO(AnswerQuestionDTO, data);
		if (errors.length) {
			callback({ status: '!OK', errors });
			this.logger.error(`Validation data error: ${errors}`, this);
			return;
		}
		try {
			await this.mainService.registerAnswer(data);

			callback({ status: 'OK', data: {} });
			io.in(data.gameCode).emit(EVENTS.playerAnswered, { data: data.playerName });
		} catch (error) {
			callback({ status: '!OK', errors: error });
		}
	}

	async handleRequestQuestionForVoting(
		socket: Socket,
		io: Server,
		data: RequestQuestionForVotingDTO,
		callback: Function,
	): Promise<void> {
		const errors = await ValidateMiddleware.validateDTO(
			RequestQuestionForVotingDTO,
			data,
		);
		if (errors.length) {
			callback({ status: '!OK', errors });
			this.logger.error(`Validation data error: ${errors}`, this);
			return;
		}
		try {
			const [question, answers] =
				await this.mainService.getQuestionWithAnswers(data);

			const startTime = Date.now() + TIMER_ADDING;

			callback({
				status: 'OK',
				data: {},
			});
			io.in(data.gameCode).emit(EVENTS.questionForVotiong, {
				data: {
					question,
					answers: [answers[0], answers[1]],
					startTime,
					duration: TIME_TO_VOTE,
				},
			});
		} catch (error) {
			callback({ status: '!OK', errors: error });
		}
	}

	async handleVoting(
		socket: Socket,
		io: Server,
		data: VotingDTO,
		callback: Function,
	): Promise<void> {
		const errors = await ValidateMiddleware.validateDTO(VotingDTO, data);
		if (errors.length) {
			callback({ status: '!OK', errors });
			this.logger.error(`Validation data error: ${errors}`, this);
			return;
		}
		try {
			this.logger.warn('vote ' + data.playerName);
			const votes = await this.mainService.voteForAnswer(data);

			callback({
				status: 'OK',
				data: votes,
			});
			io.in(data.gameCode).emit(EVENTS.sendVotes, {
				data: votes,
			});
		} catch (error) {
			callback({ status: '!OK', errors: error });
		}
	}

	async handleCalcAnswerPoints(
		socket: Socket,
		io: Server,
		data: CalcAnswerPointsDTO,
		callback: Function,
	): Promise<void> {
		const errors = await ValidateMiddleware.validateDTO(CalcAnswerPointsDTO, data);
		if (errors.length) {
			callback({ status: '!OK', errors });
			this.logger.error(`Validation data error: ${errors}`, this);
			return;
		}
		try {
			const [points, player1, player2] =
				await this.mainService.calcAnswerPoints(data);

			callback({
				status: 'OK',
				data: { points, player1, player2 },
			});
			io.in(data.gameCode).emit(EVENTS.pointsCalculated, {
				data: { points, player1, player2 },
			});
		} catch (error) {
			callback({ status: '!OK', errors: error });
		}
	}
}
