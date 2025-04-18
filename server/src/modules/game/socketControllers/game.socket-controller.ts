import { inject, injectable } from 'inversify';
import { Server, Socket } from 'socket.io';
import { ISocketController } from '../../../shared/socketControllers/socketController.interface';
import TYPES from '../../../IoC-types';
import { IGameService } from '../services/game.service.interface';
import { InitGameDTO } from '../dto/initGame.dto';
import { IPlayerService } from '../services/player.service.interface';

@injectable()
export class GameSocketController implements ISocketController {
	constructor(
		@inject(TYPES.GameService) private readonly gameService: IGameService,
		@inject(TYPES.PlayerService) private readonly playerService: IPlayerService,
	) {}
	registerHandlers(socket: Socket, io: Server): void {
		socket.on('initGame', (data: InitGameDTO) =>
			this.handleInitGame(socket, io, data),
		);
	}

	async handleInitGame(socket: Socket, io: Server, data: InitGameDTO): Promise<void> {
		const VIPName = data.playerName;
		console.log(VIPName);
		const game = await this.gameService.initGame();
		const vip = await this.playerService.addVIPPlayer(game.gameId, VIPName);

		socket.emit('initGame:success', game, vip);
	}
}
