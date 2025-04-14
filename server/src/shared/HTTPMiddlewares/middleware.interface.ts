import { NextFunction, Request, Response } from 'express';

export default interface IHTTPMiddleware {
	execute: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
