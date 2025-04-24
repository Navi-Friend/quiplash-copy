import { inject, injectable } from 'inversify';
import { VIPPlayer } from '../entities/player/VIPPlayer.entity';
import { IPlayerService } from './player.service.interface';
import TYPES from '../../../IoC-types';
import { PlayerRepository } from '../repository/player.repository';
import { AppError } from '../../../shared/errors/app/app.error';
import { JoinGameDTO } from '../dto/joinGame.dto';
import { PlayerModel } from '../models/player.model';
import { IGameRepository } from '../repository/game.repository.interface';
import { Player } from '../entities/player/player.entity';
import { Game } from '../entities/game/game.entity';

@injectable()
export class PlayerService implements IPlayerService {
	constructor(
		@inject(TYPES.PlayerRepository)
		private readonly playerRepository: PlayerRepository,
		@inject(TYPES.GameRepository) private readonly gameRepository: IGameRepository,
	) {}

	async createVIPPlayer(gameCode: string, name: string): Promise<PlayerModel> {
		const existingVIP = await this.playerRepository.getVIPPlayer(gameCode);
		if (existingVIP) {
			throw new AppError('VIP Player is already exists');
		}
		const vip = new VIPPlayer(name);
		return await this.playerRepository.setVIPPlayer(gameCode, vip);
	}

	async addPlayer({
		gameCode,
		playerName,
	}: JoinGameDTO): Promise<[PlayerModel, PlayerModel[]]> {
		const isPlayerExists = await this.checkNameExisting(gameCode, playerName);
		if (isPlayerExists) {
			throw new AppError('Player with this name is already exists');
		}

		let gameModel = await this.gameRepository.getGame(gameCode);
		if (!gameModel) {
			throw new AppError('Game instanse is not found in redis');
		}

		const game = Game.restore(gameModel);
		const newPlayer = new Player(playerName);
		game.addOnePlayer();

		gameModel = await this.gameRepository.setGame(game);

		const playerModel = await this.playerRepository.setPlayer(gameCode, newPlayer);
		const players = (await this.playerRepository.getPlayers(
			gameCode,
		)) as PlayerModel[];
		const vip = (await this.playerRepository.getVIPPlayer(gameCode)) as PlayerModel;

		return [playerModel, [vip, ...players]];
	}

	private async checkNameExisting(gameCode: string, name: string): Promise<boolean> {
		const existingPlayer = await this.playerRepository.getPlayer(gameCode, name);
		const existingVIP = await this.playerRepository.getVIPPlayer(gameCode);
		return Boolean(existingPlayer || existingVIP);
	}
}
