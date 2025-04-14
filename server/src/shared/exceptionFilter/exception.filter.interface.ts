import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../errors/http/HTTP.error';

export interface IExceptionFilter {
	catch: (
		err: Error | HTTPError,
		req: Request,
		res: Response,
		next: NextFunction,
	) => void;
}
