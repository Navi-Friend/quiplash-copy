import { Game } from '../entities/game/game.entity';
import { GameModel } from '../models/game.model';

export interface IGameRepository {
	setGame: (game: Game) => Promise<GameModel>;
	getGame: (gameCode: string) => Promise<GameModel | null>;
}
