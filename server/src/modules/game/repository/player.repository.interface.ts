import { VIPPlayer } from '../entities/player/VIPPlayer.entity';
import { VIPPlayerModel } from '../models/VIPPlayer.model';

export interface IPlayerRepository {
	setVIPPlayer(gameid: string, vip: VIPPlayer): Promise<VIPPlayerModel>;
	getVIPPlayerByName(gameId: string, name: string): Promise<VIPPlayerModel | null>;
}
