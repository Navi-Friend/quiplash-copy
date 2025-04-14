import { NextFunction, Request, Response } from 'express';

export default interface IGameController {
	initGame(req: Request, res: Response, next: NextFunction): Promise<void>;
	// startGame(req: Request, res: Response, next: NextFunction): Promise<void>;
}
