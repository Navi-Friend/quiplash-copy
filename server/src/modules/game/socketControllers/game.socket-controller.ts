import { inject, injectable } from 'inversify';
import { Server, Socket } from 'socket.io';
import { ISocketController } from '../../../shared/socketControllers/socketController.interface';
import TYPES from '../../../IoC-types';
import { IGameService } from '../services/game.service.interface';
import { InitGameDTO } from '../dto/initGame.dto';
import { IPlayerService } from '../services/player.service.interface';
import { EVENTS } from '../events';
import { ValidateMiddleware } from '../middlewares/validation.middleware';
import { ILoggerService } from '../../../shared/logger/logger.service.interface';

@injectable()
export class GameSocketController implements ISocketController {
	constructor(
		@inject(TYPES.GameService) private readonly gameService: IGameService,
		@inject(TYPES.PlayerService) private readonly playerService: IPlayerService,
		@inject(TYPES.LoggerService) private readonly logger: ILoggerService,
	) {}
	registerHandlers(socket: Socket, io: Server): void {
		socket.on(EVENTS.initGame, (data: InitGameDTO, callback) =>
			this.handleInitGame(socket, io, data, callback),
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
			let [game, vip] = await this.gameService.initGame(data);

			await socket.join(game.gameId);

			callback({ status: 'OK', data: { game, vip } });
		} catch (error) {
			callback({ status: '!OK', erros: error });
		}
	}
}
