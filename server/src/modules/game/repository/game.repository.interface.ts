import { Game } from '../entities/game.entity';
import { GameModel } from '../models/game.model';

export interface IGameRepository {
	setGame: (game: Game) => Promise<GameModel>;
	getGame: (gameId: string) => Promise<GameModel | null>;
}
