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
import { TIME_TO_ANSWER, TIMER_ADDING } from '../constants';
import { AnswerQuestionDTO } from '../dto/answerQuestion.dto';
import { RequestQuestionForVotingDTO } from '../dto/requestQuestion.dto';

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
			EVENTS.requestQuestionsForVoting,
			(data: RequestQuestionForVotingDTO, callback: Function) =>
				this.handleRequestQuestionForVoting(socket, io, data, callback),
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
			io.in(data.gameCode).emit(EVENTS.playerJoined, { data: players });
			callback({ status: 'OK', data: { player } });
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

			callback({ status: 'OK', data: { gameModel } });
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

			io.in(data.gameCode).emit(EVENTS.playerAsked, { data: data.playerName });
			callback({ status: 'OK', data: {} });
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
			callback({
				status: 'OK',
				data: { question, answers: [answers[0], answers[1]] },
			});
			io.in(data.gameCode).emit(EVENTS.questionForVotiong, {
				data: { question, answers: [answers[0], answers[1]] },
			});
		} catch (error) {
			callback({ status: '!OK', errors: error });
		}
	}
}
