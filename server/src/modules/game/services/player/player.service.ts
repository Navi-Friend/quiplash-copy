import { inject, injectable } from 'inversify';
import { VIPPlayer } from '../../entities/player/VIPPlayer.entity';
import { IPlayerService } from './player.service.interface';
import TYPES from '../../../../IoC-types';
import { AppError } from '../../../../shared/errors/app/app.error';
import { PlayerModel } from '../../models/player.model';
import { IGameService } from '../game/game.service.interface';
import { IPlayerRepository } from '../../redis-repository/player/player.repository.interface';
import { Player } from '../../entities/player/player.entity';

@injectable()
export class PlayerService implements IPlayerService {
	constructor(
		@inject(TYPES.PlayerRepository)
		private readonly playerRepository: IPlayerRepository,
		@inject(TYPES.GameService) private readonly gameService: IGameService,
	) {}

	async createVIPPlayer(gameCode: string, name: string): Promise<PlayerModel> {
		const existingVIP = await this.playerRepository.getVIPPlayer(gameCode);
		if (existingVIP) {
			throw new AppError('VIP Player is already exists');
		}
		const vip = VIPPlayer.createNew(name);
		return await this.playerRepository.setVIPPlayer(gameCode, vip);
	}

	async checkNameExisting(gameCode: string, name: string): Promise<boolean> {
		const existingPlayer = await this.playerRepository.getPlayer(gameCode, name);
		const existingVIP = await this.playerRepository.getVIPPlayer(gameCode);
		return Boolean(existingPlayer || existingVIP?.name == name);
	}

	async getPlayerInstancesWithVIPFromDB(gameCode: string): Promise<Player[]> {
		const playerModels = await this.playerRepository.getPlayers(gameCode);
		if (!playerModels) {
			throw new AppError('Player instances are not found in redis');
		}

		const vip = await this.playerRepository.getVIPPlayer(gameCode);
		if (!vip) {
			throw new AppError('VIP instances is not found in redis');
		}

		let players = playerModels.map((p) => Player.restore(p));
		players = [VIPPlayer.restore(vip), ...players];
		return players;
	}
}
