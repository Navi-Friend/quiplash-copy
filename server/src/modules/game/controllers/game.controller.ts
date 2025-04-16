import { inject, injectable } from 'inversify';
import TYPES from '../../../container-types';
import BaseHTTPController from '../../../shared/HTTPController/base.controller';
import { ILoggerService } from '../../../shared/logger/logger.service.interface';
import { NextFunction, Response, Request } from 'express';
import IGameController from './game.controller.interface';
import AuthPlayer from '../middlewares/authPlayer.middleware';
import IGameService from '../services/game.service.interface';

@injectable()
export default class GameController
	extends BaseHTTPController
	implements IGameController
{
	constructor(@inject(TYPES.LoggerService) logger: ILoggerService, 
	@inject(TYPES.GameService) private readonly gameService: IGameService) {
		super(logger);
		this.logger.info("asdf", this)

		this.bindRoutes([
			{
				path: '/init-game',
				method: 'get',
				func: this.initGame,
				middlewares: [new AuthPlayer()]
			},
		]);
	}

	async initGame(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (!req.authenticated) {
			this.gameService.initGame(req.body.playerName)
			// io init socket room

		}
		res.send(200)
    }

	// async startGame(req: Request, res: Response, next: NextFunction): Promise<void> {}
}
