import { inject, injectable } from 'inversify';
import TYPES from '../../../IoC-types';
import { RedisService } from '../../../shared/redis/redis.service';
import { VIPPlayer } from '../entities/player/VIPPlayer.entity';
import { VIPPlayerModel } from '../models/VIPPlayer.model';
import { AppError } from '../../../shared/errors/app/app.error';
import { IPlayerRepository } from './player.repository.interface';
import { ILoggerService } from '../../../shared/logger/logger.service.interface';

@injectable()
export class PlayerRepository implements IPlayerRepository {
	constructor(
		@inject(TYPES.RedisService) private readonly redisService: RedisService,
		@inject(TYPES.LoggerService) private readonly logger: ILoggerService,
	) {}

	async setVIPPlayer(gameid: string, vip: VIPPlayer): Promise<VIPPlayerModel> {
		try {
			const vipModel: VIPPlayerModel = {
				playerId: vip.playerId,
				name: vip.name,
				points: vip.points,
			};
			await this.redisService.redis.hSet(
				`game:${gameid}:players:${vip.name}`,
				this.toRedisHash(vipModel),
			);
			this.logger.debug('VIP is set to redis', this);
			return vipModel;
		} catch (error) {
			this.logger.error('VIP is not set to redis', this);
			throw new AppError('Error while set VIP Player', error as Error);
		}
	}

	async getVIPPlayerByName(
		gameId: string,
		name: string,
	): Promise<VIPPlayerModel | null> {
		try {
			const VIPPlain = await this.redisService.redis.hGetAll(
				`game:${gameId}:players:${name}`,
			);

			this.logger.debug('VIP is gotten from redis', this);

			return this.fromRedisHash(VIPPlain);
		} catch (error) {
			this.logger.error('VIP is not gotten from redis', this);

			throw new AppError('Error while get VIP Player', error as Error);
		}
	}

	private toRedisHash(player: VIPPlayerModel): Record<string, string> {
		return {
			playerId: player.playerId,
			name: player.name,
			points: player.points.toString(),
		};
	}

	private fromRedisHash(data: Record<string, string>): VIPPlayerModel | null {
		return Object.keys(data).length != 0
			? {
					playerId: data.playerId,
					name: data.name,
					points: parseInt(data.points),
				}
			: null;
	}
}
