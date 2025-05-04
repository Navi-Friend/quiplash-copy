import { Game } from '../../entities/game/game.entity';
import { inject, injectable } from 'inversify';
import TYPES from '../../../../IoC-types';
import { GameModel } from '../../models/game.model';
import { AppError } from '../../../../shared/errors/app/app.error';
import { IGameService } from './game.service.interface';
import { IGameRepository } from '../../redis-repository/game/game.repository.interface';

@injectable()
export class GameService implements IGameService {
	constructor(
		@inject(TYPES.GameRepository) private readonly gameRepository: IGameRepository,
	) {}

	async getGameInstanceFromDB(gameCode: string): Promise<Game> {
		const gameModel = await this.gameRepository.getGame(gameCode);
		if (!gameModel) {
			throw new AppError('Game is empty in redis');
		}

		return Game.restore(gameModel);
	}

	async addPlayerToGame(gameCode: string): Promise<GameModel> {
		const game = await this.getGameInstanceFromDB(gameCode);
		game.addOnePlayer();
		const gameModel = await this.gameRepository.setGame(game);
		return gameModel;
	}
}
