import { inject, injectable } from 'inversify';
import TYPES from '../../../IoC-types';
import { RedisService } from '../../../shared/redis/redis.service';
import { Game } from '../entities/game/game.entity';
import { GameModel } from '../models/game.model';
import { AppError } from '../../../shared/errors/app/app.error';
import { GameStatus } from '../entities/game/gameStatus';
import { ILoggerService } from '../../../shared/logger/logger.service.interface';
import { BaseRedisRepository } from '../../../shared/redis/base.repository';
import { IGameRepository } from './game.repository.interface';

@injectable()
export class GameRepository extends BaseRedisRepository implements IGameRepository {
	constructor(
		@inject(TYPES.RedisService) private readonly redisService: RedisService,
		@inject(TYPES.LoggerService) private readonly logger: ILoggerService,
	) {
		super();
	}

	async setGame(game: Game): Promise<GameModel> {
		try {
			const gameModel: GameModel = {
				gameCode: game.gameCode,
				totalRounds: game.totalRounds,
				currentRound: game.currentRound,
				maxPlayers: game.maxPlayers,
				currentPlayers: game.currentPlayers,
				gameStatus: game.gameStatus,
				spectators: game.spectators,
			};

			await this.redisService.redis.hSet(
				`game:${game.gameCode}`,
				this.modelToRedisHash(gameModel),
			);
			this.logger.debug('Game is set to redis', this);
			return gameModel;
		} catch (error) {
			this.logger.error('Game is not set to redis', this);
			throw new AppError('Error while set game to redis', error as Error);
		}

		// Bad approach because we can't get some batch of data. We get all data about game,
		// players, rounds etc. Hard to separate entities
		// await this.redisService.redis.set(`game:${game.gameId}`, JSON.stringify(game));
	}

	async getGame(gameCode: string): Promise<GameModel | null> {
		try {
			const plainGame = await this.redisService.redis.hGetAll(`game:${gameCode}`);
			this.logger.debug('Game is gotten from redis', this);
			return this.fromRedisHashToModel(plainGame);
		} catch (error) {
			this.logger.error('Game is not gotten from redis', this);
			throw new AppError('Error while get game to redis', error as Error);
		}
	}

	fromRedisHashToModel(data: Record<string, string>): GameModel | null {
		return Object.keys(data).length != 0
			? {
					gameCode: data.gameCode,
					totalRounds: parseInt(data.totalRounds),
					currentRound: parseInt(data.currentRound),
					maxPlayers: parseInt(data.maxPlayers),
					currentPlayers: parseInt(data.currentPlayers),
					gameStatus: data.gameStatus as GameStatus,
					spectators: parseInt(data.spectators),
				}
			: null;
	}
}
