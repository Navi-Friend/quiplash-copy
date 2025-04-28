import { inject, injectable } from 'inversify';
import { InitGameDTO } from '../dto/initGame.dto';
import { GameModel } from '../models/game.model';
import { PlayerModel } from '../models/player.model';
import TYPES from '../../../IoC-types';
import { IPlayerService } from './player/player.service.interface';
import { Game } from '../entities/game/game.entity';
import { IPlayerRepository } from '../redis-repository/player/player.repository.interface';
import { IGameService } from './game/game.service.interface';
import { Player } from '../entities/player/player.entity';
import { AppError } from '../../../shared/errors/app/app.error';
import { JoinGameDTO } from '../dto/joinGame.dto';
import { StartGameDTO } from '../dto/startGame.dto';
import { IGameRepository } from '../redis-repository/game/game.repository.interface';
import { IGameOrhestrator } from './gameOrchestrator.service.interface';
import { PlayerQuestions, Round } from '../entities/round.entity';
import { IRoundService } from './round/round.service.interface';
import { AnswerQuestionDTO } from '../dto/answerQuestion.dto';

@injectable()
export class GameOrchestrator implements IGameOrhestrator {
	constructor(
		@inject(TYPES.PlayerService) private readonly playerService: IPlayerService,
		@inject(TYPES.PlayerRepository)
		private readonly playerRepository: IPlayerRepository,
		@inject(TYPES.GameService) private readonly gameService: IGameService,
		@inject(TYPES.GameRepository) private readonly gameRepository: IGameRepository,
		@inject(TYPES.RoundService) private readonly roundService: IRoundService,
	) {}

	async initGame({
		playerName,
	}: InitGameDTO): Promise<[GameModel, PlayerModel | null]> {
		const game = Game.createNew();

		const vipModel = await this.playerService.createVIPPlayer(
			game.gameCode,
			playerName,
		);
		game.addOnePlayer();

		const gameModel = await this.gameRepository.setGame(game);

		return [gameModel, vipModel];
	}

	async addPlayer({
		gameCode,
		playerName,
	}: JoinGameDTO): Promise<[PlayerModel, PlayerModel[]]> {
		const isPlayerExists = await this.playerService.checkNameExisting(
			gameCode,
			playerName,
		);
		if (isPlayerExists) {
			throw new AppError('Player with this name is already exists');
		}

		const newPlayer = Player.createNew(playerName);

		await this.gameService.addPlayerToGame(gameCode);

		const playerModel = await this.playerRepository.setPlayer(gameCode, newPlayer);
		const players = (await this.playerRepository.getPlayers(
			gameCode,
		)) as PlayerModel[];

		const vip = (await this.playerRepository.getVIPPlayer(gameCode)) as PlayerModel;

		return [playerModel, [vip, ...players]];
	}

	async startGame({
		gameCode,
	}: StartGameDTO): Promise<[GameModel, PlayerModel[], PlayerQuestions[]]> {
		const game = await this.gameService.getGameInstanceFromDB(gameCode);
		game.startGame();
		const gameModel = await this.gameRepository.setGame(game);
		const players = (await this.playerRepository.getPlayers(
			game.gameCode,
		)) as PlayerModel[];

		const questions = await this.startRound(gameCode);
		return [gameModel, players, questions];
	}

	async startRound(gameCode: string): Promise<PlayerQuestions[]> {
		const players =
			await this.playerService.getPlayerInstancesWithVIPFromDB(gameCode);
		const questions = await this.roundService.getQuestionInstancesFromDB(
			players.length,
		);
		const round = Round.createNew(players, questions);
		console.log(round);
		return round.distributeQuestions();
	}

	async registerAnswer(data: AnswerQuestionDTO): Promise<void> {
		
	}
}
