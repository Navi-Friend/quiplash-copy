import { inject, injectable } from 'inversify';
import { ILoggerService } from '../logger/logger.service.interface';
import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../errors/http/HTTP.error';
import { IExceptionFilter } from './exception.filter.interface';
import TYPES from '../../container-types';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(
		@inject(TYPES.LoggerService) private readonly logger: ILoggerService,
	) {}

	catch(
		err: Error | HTTPError,
		req: Request,
		res: Response,
		next: NextFunction,
	): void {
		if (err instanceof HTTPError) {
			this.logger.error(
				JSON.stringify({ ...err, ...err.getServiceInfo() }, null, 2),
				this,
			);
			res.status(err.statusCode).json({ error: err });
		} else {
			this.logger.error('Unhandled error:', this);
			res.status(500).json({ error: err });
		}
	}
}
