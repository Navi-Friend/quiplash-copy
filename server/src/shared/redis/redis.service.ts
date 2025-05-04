import { inject, injectable } from 'inversify';
import { createClient, RedisClientType } from 'redis';
import TYPES from '../../IoC-types';
import { ILoggerService } from '../logger/logger.service.interface';

@injectable()
export class RedisService {
	redis: RedisClientType;
	constructor(@inject(TYPES.LoggerService) private readonly logger: ILoggerService) {
		this.redis = createClient({
			url: 'redis://127.0.0.1:6379',
			socket: {
				reconnectStrategy: (retries) => {
					this.logger.info(`Попытка переподключения #${retries}`, this);
					return Math.min(retries * 100, 5000);
				},
			},
		});
		this.redis.on('error', (err) => {
			this.logger.error(`Redis error: ${err}`, this);
		});
	}

	async connect(): Promise<void> {
		try {
			await this.redis.connect();
			this.logger.info('Redis is connected', this);
		} catch (error) {
			this.logger.info('Redis connection error', this);
		}
	}

	async disconnect(): Promise<void> {
		try {
			await this.redis.disconnect();
			this.logger.info('Redis is disconnected', this);
		} catch (error) {
			this.logger.info('Redis disconnection error', this);
		}
	}
}
