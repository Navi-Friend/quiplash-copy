import { Request, Response, NextFunction } from 'express';
import IHTTPMiddleware from '../../../shared/middlewares/HTTPmiddleware.interface';

export default class AuthPlayer implements IHTTPMiddleware {
	async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
		const cookies = req.cookies;
		if (cookies?.gameId && cookies?.roomId) {
			req.authenticated = true;
			next();
		}
	}
}
