import { PlayerModel } from '../../models/player.model';

export interface IPlayerService {
	createVIPPlayer: (gameCode: string, name: string) => Promise<PlayerModel>;
	checkNameExisting(gameCode: string, name: string): Promise<boolean>;
}
