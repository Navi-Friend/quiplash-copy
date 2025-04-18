import { inject, injectable } from 'inversify';
import { VIPPlayer } from '../entities/player/VIPPlayer.entity';
import { IPlayerService } from './player.service.interface';
import TYPES from '../../../IoC-types';
import { PlayerRepository } from '../repository/player.repository';
import { AppError } from '../../../shared/errors/app/app.error';
import { VIPPlayerModel } from '../models/VIPPlayer.model';

@injectable()
export class PlayerService implements IPlayerService {
	constructor(
		@inject(TYPES.PlayerRepository)
		private readonly playerRepository: PlayerRepository,
	) {}

	async addVIPPlayer(gameId: string, name: string): Promise<VIPPlayerModel> {
		const existingVIP = await this.playerRepository.getVIPPlayerByName(gameId, name);
		if (existingVIP) {
			throw new AppError('VIP Player is already exists');
		}
		const vip = new VIPPlayer(name);
		return await this.playerRepository.setVIPPlayer(gameId, vip);
	}
}
