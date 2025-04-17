import redisClient from '../../../shared/redis/redis.service';
import VIPPlayer from '../entities/player/VIPPlayer.entity';
import Game from '../entities/game.entity';
import IGameService from './game.service.interface';
import { injectable } from 'inversify';

@injectable()
export default class GameService implements IGameService {
	constructor() {}

	// async registerPlayer(req: Request, res: Response, next: NextFunction): Promise<void> {

	// }

	async initGame(playerName: string): Promise<void> {
		const isUniqueName = (await redisClient.get(playerName)) == null;
		if (!isUniqueName) {
			throw new Error();
		}
		const vip = new VIPPlayer(playerName);
		const game = new Game(vip);

		await redisClient.set('VIPPlayer', playerName);
	}
}
