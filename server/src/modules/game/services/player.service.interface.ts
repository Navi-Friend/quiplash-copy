import { Game } from '../entities/game/game.entity';
import { VIPPlayer } from '../entities/player/VIPPlayer.entity';

export interface IPlayerService {
	createVIPPlayer: (gameId: string, name: string) => Promise<VIPPlayer>;
}
