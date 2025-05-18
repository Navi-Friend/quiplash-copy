import { inject, injectable } from 'inversify';
import TYPES from '../../../../IoC-types';
import { RedisService } from '../../../../shared/redis/redis.service';
import { VIPPlayer } from '../../entities/player/VIPPlayer.entity';
import { AppError } from '../../../../shared/errors/app/app.error';
import { IPlayerRepository } from './player.repository.interface';
import { ILoggerService } from '../../../../shared/logger/logger.service.interface';
import { PlayerModel } from '../../models/player.model';
import { Player } from '../../entities/player/player.entity';
import { BaseRedisRepository } from '../../../../shared/redis/base.repository';

@injectable()
export class PlayerRepository extends BaseRedisRepository implements IPlayerRepository {
	private _isPlayersArrExists: string[];
	constructor(
		@inject(TYPES.RedisService) private readonly redisService: RedisService,
		@inject(TYPES.LoggerService) private readonly logger: ILoggerService,
	) {
		super();
		this._isPlayersArrExists = [];
	}

	async setVIPPlayer(gameCode: string, vip: VIPPlayer): Promise<PlayerModel> {
		try {
			const vipModel: PlayerModel = {
				playerId: vip.playerId,
				name: vip.name,
				avatarNumber: vip.avatarNumber || -1,
				score: vip.score,
			};

			await this.redisService.redis.hSet(
				`game:${gameCode}:vip`,
				this.modelToRedisHash(vipModel),
			);

			this.logger.debug(`VIP is set to redis: ${JSON.stringify(vipModel)}`, this);

			return vipModel;
		} catch (error) {
			this.logger.error('VIP is not set to redis', this);
			throw new AppError('Error while set VIP Player', error as Error);
		}
	}

	async getVIPPlayer(gameCode: string): Promise<PlayerModel | null> {
		try {
			const VIPPlain = await this.redisService.redis.hGetAll(
				`game:${gameCode}:vip`,
			);

			this.logger.debug(
				`VIP is gotten from redis: ${JSON.stringify(VIPPlain)}`,
				this,
			);

			return this.fromRedisHashToModel(VIPPlain);
		} catch (error) {
			this.logger.error(`VIP is not gotten from redis, ${error}`, this);
			throw new AppError(`Error while get VIP Player`, error as Error);
		}
	}

	async updateVIPScore(gameCode: string, newScore: number): Promise<PlayerModel> {
		try {
			await this.redisService.redis.hSet(`game:${gameCode}:vip`, 'score', newScore);

			this.logger.debug(
				`VIP score is updated in redis: ${JSON.stringify(newScore)}`,
				this,
			);

			return (await this.getVIPPlayer(gameCode)) as PlayerModel;
		} catch (error) {
			this.logger.error('VIP score is not updated in redis', this);
			throw new AppError('Error while update VIP score', error as Error);
		}
	}

	async setPlayer(gameCode: string, player: Player): Promise<PlayerModel> {
		try {
			const playerModel: PlayerModel = {
				playerId: player.playerId,
				name: player.name,
				avatarNumber: player.avatarNumber || -1,
				score: player.score,
			};
			await this.createPlayersArrIfNotExists(gameCode);
			await this.redisService.redis.json.arrAppend(
				`game:${gameCode}:players`,
				'$',
				this.modelToRedisHash(playerModel),
			);

			this.logger.debug(
				`Player is set to redis: ${JSON.stringify(playerModel)}`,
				this,
			);

			return playerModel;
		} catch (error) {
			this.logger.error(`Player is not set to redis: ${error}`, this);
			throw new AppError('Error while set player', error as Error);
		}
	}

	async updatePlayerScore(
		gameCode: string,
		playerName: string,
		newScore: number,
	): Promise<PlayerModel> {
		try {
			const response = await this.redisService.redis.json.set(
				`game:${gameCode}:players`,
				`$.[?(@name == "${playerName}")].score`,
				newScore,
			);

			this.logger.debug(
				`Player score was updated in redis: ${JSON.stringify(response)}`,
				this,
			);

			return (await this.getPlayer(gameCode, playerName)) as PlayerModel;
		} catch (error) {
			this.logger.error(`Player score was not updated in redis: ${error}`, this);
			throw new AppError("Error while update player's score", error as Error);
		}
	}

	async getPlayer(gameCode: string, name: string): Promise<PlayerModel | null> {
		try {
			const players = await this.getPlayers(gameCode);
			console.log(JSON.stringify(players) + ' players');
			if (!players) {
				return null;
			}
			const player = players?.find((p) => p.name == name);

			this.logger.debug(
				`Player is gotten from redis: ${JSON.stringify(player)}`,
				this,
			);

			return player || null;
		} catch (error) {
			this.logger.error('Player is not gotten from redis', this);
			throw new AppError('Error while get player', error as Error);
		}
	}

	async getPlayers(gameCode: string): Promise<PlayerModel[] | null> {
		try {
			const playersPlain = (await this.redisService.redis.json.get(
				`game:${gameCode}:players`,
			)) as object[] | null;

			this.logger.debug(
				`Players are gotten from redis: ${JSON.stringify(playersPlain)}`,
				this,
			);

			if (!playersPlain) {
				return null;
			}
			if (playersPlain.length) {
				return playersPlain as PlayerModel[];
			}
			return null;
		} catch (error) {
			this.logger.error(`Players are not gotten from redis`, this);
			throw new AppError('Error while get players', error as Error);
		}
	}

	private fromRedisHashToModel(data: Record<string, string>): PlayerModel | null {
		return Object.keys(data).length != 0
			? {
					playerId: data.playerId,
					name: data.name,
					avatarNumber: parseInt(data.avatarNumber),
					score: parseInt(data.score),
				}
			: null;
	}

	private async createPlayersArrIfNotExists(gameCode: string): Promise<void> {
		console.log(this._isPlayersArrExists);
		if (!this._isPlayersArrExists.includes(gameCode)) {
			await this.redisService.redis.json.set(`game:${gameCode}:players`, '$', []);
			this._isPlayersArrExists.push(gameCode);
		}
	}
}
