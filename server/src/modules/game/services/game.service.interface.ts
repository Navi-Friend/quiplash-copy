import { InitGameDTO } from '../dto/initGame.dto';
import { GameModel } from '../models/game.model';
import { PlayerModel } from '../models/player.model';

export interface IGameService {
	initGame(data: InitGameDTO): Promise<[GameModel, PlayerModel | null]>;
}
