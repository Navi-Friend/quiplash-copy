import { Player } from '../../entities/player/player.entity';
import { PlayerModel } from '../../models/player.model';

export interface IPlayerService {
	createVIPPlayer: (gameCode: string, name: string) => Promise<PlayerModel>;
	checkNameExisting(gameCode: string, name: string): Promise<boolean>;
	getPlayerInstancesWithVIPFromDB(gameCode: string): Promise<Player[]>;
	updatePlayerScore(
		gameCode: string,
		playerName: string,
		scoreAdding: number,
	): Promise<PlayerModel>;
}
