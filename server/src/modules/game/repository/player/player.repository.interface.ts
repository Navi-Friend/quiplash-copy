import { Player } from '../../entities/player/player.entity';
import { VIPPlayer } from '../../entities/player/VIPPlayer.entity';
import { PlayerModel } from '../../models/player.model';

export interface IPlayerRepository {
	setVIPPlayer(gameCode: string, vip: VIPPlayer): Promise<PlayerModel>;
	getVIPPlayer(gameCode: string): Promise<PlayerModel | null>;

	setPlayer(gameCode: string, player: Player): Promise<PlayerModel>;
	getPlayer(gameCode: string, name: string): Promise<PlayerModel | null>;
	getPlayers(gameCode: string): Promise<PlayerModel[] | null>;
}
