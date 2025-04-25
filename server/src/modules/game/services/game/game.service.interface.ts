import { Game } from '../../entities/game/game.entity';
import { GameModel } from '../../models/game.model';

export interface IGameService {
	getGameInstanceFromDB(gameCode: string): Promise<Game>;
	addPlayerToGame(gameCode: string): Promise<GameModel>;
}
