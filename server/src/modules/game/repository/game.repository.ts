import { inject, injectable } from 'inversify';
import TYPES from '../../../IoC-types';
import { RedisService } from '../../../shared/redis/redis.service';
import { Game } from '../entities/game.entity';
import { GameModel } from '../models/game.model';
import { AppError } from '../../../shared/errors/app/app.error';

@injectable()
export class GameRepository {
	constructor(
		@inject(TYPES.RedisService) private readonly redisService: RedisService,
	) {}

	async setGame(game: Game): Promise<GameModel> {
		try {
			const gameModel: GameModel = {
				gameId: game.gameId,
				gameCode: game.gameCode,
				totalRounds: game.totalRounds,
				currentRound: game.currentRound,
				maxPlayers: game.maxPlayers,
			};

			console.log(gameModel);
			await this.redisService.redis.hSet(
				`game:${game.gameId}`,
				this.toRedisHash(gameModel),
			);
			return gameModel;
		} catch (error) {
			throw new AppError('Error while set game to redis', error as Error);
		}

		// Bad approach because we can't get some batch of data. We get all data about game,
		// players, rounds etc. Hard to separate entities
		// await this.redisService.redis.set(`game:${game.gameId}`, JSON.stringify(game));
	}

	async getGame(gameId: string): Promise<GameModel | null> {
		try {
			const plainGame = await this.redisService.redis.hGetAll(`game:${gameId}`);
			return this.fromRedisHash(plainGame);
		} catch (error) {
			throw new AppError('Error while get game to redis', error as Error);
		}
	}

	private toRedisHash(game: GameModel): Record<string, string> {
		return {
			gameId: game.gameId,
			gameCode: game.gameCode,
			totalRounds: game.totalRounds.toString(),
			currentRound: game.currentRound.toString(),
			maxPlayers: game.maxPlayers.toString(),
		};
	}

	private fromRedisHash(data: Record<string, string>): GameModel | null {
		return Object.keys(data).length != 0
			? {
					gameId: data.gameId,
					gameCode: data.gameCode,
					totalRounds: parseInt(data.totalRounds),
					currentRound: parseInt(data.currentRound),
					maxPlayers: parseInt(data.maxPlayers),
				}
			: null;
	}
}
