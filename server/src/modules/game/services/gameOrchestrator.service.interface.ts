import { InitGameDTO } from '../dto/initGame.dto';
import { JoinGameDTO } from '../dto/joinGame.dto';
import { StartGameDTO } from '../dto/startGame.dto';
import { GameModel } from '../models/game.model';
import { PlayerModel } from '../models/player.model';

export interface IGameOrhestrator {
	initGame(data: InitGameDTO): Promise<[GameModel, PlayerModel | null]>;
	addPlayer(data: JoinGameDTO): Promise<[PlayerModel, PlayerModel[]]>;
	startGame(data: StartGameDTO): Promise<GameModel>;
}
