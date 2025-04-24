import { JoinGameDTO } from '../dto/joinGame.dto';
import { VIPPlayer } from '../entities/player/VIPPlayer.entity';
import { PlayerModel } from '../models/player.model';

export interface IPlayerService {
	createVIPPlayer: (gameCode: string, name: string) => Promise<PlayerModel>;
	addPlayer: (data: JoinGameDTO) => Promise<[PlayerModel, PlayerModel[]]>;
}
