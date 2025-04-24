import { Game } from '../entities/game/game.entity';
import { IGameService } from './game.service.interface';
import { inject, injectable } from 'inversify';
import TYPES from '../../../IoC-types';
import { IGameRepository } from '../repository/game.repository.interface';
import { GameModel } from '../models/game.model';
import { IPlayerService } from './player.service.interface';
import { InitGameDTO } from '../dto/initGame.dto';
import { IPlayerRepository } from '../repository/player.repository.interface';
import { PlayerModel } from '../models/player.model';

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
	}: InitGameDTO): Promise<[GameModel, PlayerModel | null]> {
		const game = Game.createNew();
		const vipModel = await this.playerService.createVIPPlayer(
			game.gameCode,
			playerName,
		);
		// game.VIPPlayer = vip;
		game.addOnePlayer();

		const gameModel = await this.gameRepository.setGame(game);

		return [gameModel, vipModel];
	}
}
