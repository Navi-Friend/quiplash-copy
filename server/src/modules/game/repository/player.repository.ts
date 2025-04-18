import { inject, injectable } from 'inversify';
import TYPES from '../../../IoC-types';
import { RedisService } from '../../../shared/redis/redis.service';
import { VIPPlayer } from '../entities/player/VIPPlayer.entity';
import { VIPPlayerModel } from '../models/VIPPlayer.model';
import { AppError } from '../../../shared/errors/app/app.error';

@injectable()
export class PlayerRepository {
	constructor(
		@inject(TYPES.RedisService) private readonly redisService: RedisService,
	) {}

	async setVIPPlayer(gameid: string, vip: VIPPlayer): Promise<VIPPlayerModel> {
		try {
			const vipModel: VIPPlayerModel = {
				playerId: vip.playerId,
				name: vip.name,
				points: vip.points,
			};
			console.log(vipModel);
			await this.redisService.redis
				.multi()
				.hSet(`player:${vip.playerId}`, this.toRedisHash(vipModel))
				.sAdd(`game:${gameid}:players`, vip.playerId)
				.exec();
			return vipModel;
		} catch (error) {
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
			return this.fromRedisHash(VIPPlain);
		} catch (error) {
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
