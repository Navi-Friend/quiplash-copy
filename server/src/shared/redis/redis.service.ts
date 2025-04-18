import { injectable } from 'inversify';
import { createClient, RedisClientType } from 'redis';

@injectable()
export class RedisService {
	redis: RedisClientType;
	constructor() {
		this.redis = createClient({
			url: 'redis://127.0.0.1:6379',
			socket: {
				reconnectStrategy: (retries) => {
					console.log(`Попытка переподключения #${retries}`);
					return Math.min(retries * 100, 5000);
				},
			},
		});
		this.redis.on('error', (err) => {
			console.error('Redis error:', err);
		});
	}

	async connect(): Promise<void> {
		try {
			await this.redis.connect();
			
		} catch (error) {
			console.log('Reidis connection error');
		}
	}

	async disconnect(): Promise<void> {
		try {
			await this.redis.disconnect();
		} catch (error) {
			console.log('Reidis disconnection error');
		}
	}
}
