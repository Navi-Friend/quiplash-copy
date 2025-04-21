import { Game } from '../entities/game/game.entity';
import { IGameService } from './game.service.interface';
import { inject, injectable } from 'inversify';
import TYPES from '../../../IoC-types';
import { IGameRepository } from '../repository/game.repository.interface';
import { GameModel } from '../models/game.model';
import { IPlayerService } from './player.service.interface';
import { InitGameDTO } from '../dto/initGame.dto';
import { IPlayerRepository } from '../repository/player.repository.interface';
import { VIPPlayerModel } from '../models/VIPPlayer.model';

@injectable()
export class GameService implements IGameService {
	constructor(
		@inject(TYPES.GameRepository) private readonly gameRepository: IGameRepository,
		@inject(TYPES.PlayerService) private readonly playerService: IPlayerService,
		@inject(TYPES.PlayerRepository)
		private readonly playerRepository: IPlayerRepository,
	) {}

	async initGame({
		playerName,
	}: InitGameDTO): Promise<[GameModel, VIPPlayerModel | null]> {
		const game = new Game();
		const vip = await this.playerService.createVIPPlayer(game.gameId, playerName);
		game.VIPPlayer = vip;

		const gameModel = await this.gameRepository.setGame(game);
		const vipModel = await this.playerRepository.getVIPPlayerByName(
			game.gameId,
			vip.name,
		);
		return [gameModel, vipModel];
	}
}
