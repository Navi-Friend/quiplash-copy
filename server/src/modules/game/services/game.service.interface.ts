import { InitGameDTO } from '../dto/initGame.dto';
import { GameModel } from '../models/game.model';
import { VIPPlayerModel } from '../models/VIPPlayer.model';

export interface IGameService {
	initGame(data: InitGameDTO): Promise<[GameModel, VIPPlayerModel | null]>;
}
