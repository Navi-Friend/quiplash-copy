import { inject, injectable } from 'inversify';
import { Server, Socket } from 'socket.io';
import { ISocketController } from '../../../shared/socketControllers/socketController.interface';
import TYPES from '../../../IoC-types';
import { InitGameDTO } from '../dto/initGame.dto';
import { IPlayerService } from '../services/player/player.service.interface';
import { EVENTS } from '../events';
import { ValidateMiddleware } from '../middlewares/validation.middleware';
import { ILoggerService } from '../../../shared/logger/logger.service.interface';
import { JoinGameDTO } from '../dto/joinGame.dto';
import { StartGameDTO } from '../dto/startGame.dto';
import { IGameOrhestrator } from '../services/gameOrchestrator.service.interface';

@injectable()
export class GameSocketController implements ISocketController {
	constructor(
		@inject(TYPES.GameOrchestratorService)
		private readonly mainService: IGameOrhestrator,
		@inject(TYPES.LoggerService) private readonly logger: ILoggerService,
	) {}
	registerHandlers(socket: Socket, io: Server): void {
		socket.on(EVENTS.initGame, (data: InitGameDTO, callback: Functino) =>
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
			console.log(data);
			const [player, players] = await this.mainService.addPlayer(data);

			await socket.join(data.gameCode);
			io.in(data.gameCode).emit(EVENTS.playerJoined, { players });
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
			const gameModel = await this.mainService.startGame(data);
			callback({ status: 'OK', data: { gameModel } });
		} catch (error) {
			callback({ status: '!OK', errors: error });
		}
	}
}
