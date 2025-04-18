import { NextFunction, Request, Response } from 'express';

export interface IHTTPMiddleware {
	execute: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
