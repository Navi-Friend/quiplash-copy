import { NextFunction, Request, Response } from 'express';
import IBaseHTTPController from '../../../shared/HTTPController/base.controller.interface';

export default interface IGameController extends IBaseHTTPController {
	initGame(req: Request, res: Response, next: NextFunction): Promise<void>;
	// startGame(req: Request, res: Response, next: NextFunction): Promise<void>;
}
