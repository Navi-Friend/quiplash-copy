import { Game } from '../entities/game.entity';
import { IGameService } from './game.service.interface';
import { inject, injectable } from 'inversify';
import TYPES from '../../../IoC-types';
import { IGameRepository } from '../repository/game.repository.interface';
import { GameModel } from '../models/game.model';

@injectable()
export class GameService implements IGameService {
	constructor(
		@inject(TYPES.GameRepository) private readonly gameRepository: IGameRepository,
	) {}

	async initGame(): Promise<GameModel> {
		const game = new Game();

		return await this.gameRepository.setGame(game);
	}
}
