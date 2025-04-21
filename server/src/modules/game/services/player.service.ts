import { inject, injectable } from 'inversify';
import { VIPPlayer } from '../entities/player/VIPPlayer.entity';
import { IPlayerService } from './player.service.interface';
import TYPES from '../../../IoC-types';
import { PlayerRepository } from '../repository/player.repository';
import { AppError } from '../../../shared/errors/app/app.error';
import { Game } from '../entities/game/game.entity';

@injectable()
export class PlayerService implements IPlayerService {
	constructor(
		@inject(TYPES.PlayerRepository)
		private readonly playerRepository: PlayerRepository,
	) {}

	async createVIPPlayer(gameId: string, name: string): Promise<VIPPlayer> {
		const existingVIP = await this.playerRepository.getVIPPlayerByName(gameId, name);
		if (existingVIP) {
			throw new AppError('VIP Player is already exists');
		}
		const vip = new VIPPlayer(name);
		await this.playerRepository.setVIPPlayer(gameId, vip);
		return vip;
	}
}
