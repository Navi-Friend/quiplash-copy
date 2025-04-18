import { VIPPlayerModel } from '../models/VIPPlayer.model';

export interface IPlayerService {
	addVIPPlayer: (gameId: string, name: string) => Promise<VIPPlayerModel | null>;
}
