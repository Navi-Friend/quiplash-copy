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
			const [gameModel, playerModels, questoins] =
				await this.mainService.startGame(data);

			const startTime = Date.now() + TIMER_ADDING;

			console.log(questoins);
			io.to(data.gameCode).emit(EVENTS.gameStarted, {
				data: {
					game: gameModel,
					players: playerModels,
					questoins,
					startTime,
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
	) {
		const errors = await ValidateMiddleware.validateDTO(AnswerQuestionDTO, data);
		if (errors.length) {
			callback({ status: '!OK', errors });
			this.logger.error(`Validation data error: ${errors}`, this);
			return;
		}
		try {
			const [player, players] = await this.mainService.registerAnswer(data);

			await socket.join(data.gameCode);
			io.in(data.gameCode).emit(EVENTS.playerJoined, { data: players });
			callback({ status: 'OK', data: { player } });
		} catch (error) {
			callback({ status: '!OK', errors: error });
		}
	}
}
