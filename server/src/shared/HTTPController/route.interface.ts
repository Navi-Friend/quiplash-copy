import { NextFunction, Response, Request, IRouter, Router } from 'express';
import { IHTTPMiddleware } from '../middlewares/http.middleware.interface';

export interface IHTTPRoute {
	path: string;
	func: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	method: keyof Pick<Router, 'get' | 'post' | 'patch' | 'put' | 'delete'>;
	middlewares?: IHTTPMiddleware[];
}
