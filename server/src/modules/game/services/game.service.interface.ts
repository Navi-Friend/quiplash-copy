import { GameModel } from '../models/game.model';

export interface IGameService {
	initGame(): Promise<GameModel>;
}
