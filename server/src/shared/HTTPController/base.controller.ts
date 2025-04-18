import { Router } from 'express';
import { IBaseHTTPController } from './base.controller.interface';
import { IHTTPRoute } from './route.interface';
import { inject, injectable } from 'inversify';
import TYPES from '../../IoC-types';
import { ILoggerService } from '../logger/logger.service.interface';

@injectable()
export abstract class BaseHTTPController implements IBaseHTTPController {
	private _router: Router;
	constructor(@inject(TYPES.LoggerService) protected readonly logger: ILoggerService) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	bindRoutes(routes: IHTTPRoute[]): void {
		for (const route of routes) {
			const middlewares = route.middlewares?.map((m) => {
				this.logger.info(
					`HTTP Middleware [${m.constructor.name}] connected to ${route.path}`,
					m,
				);
				return m.execute.bind(m);
			});
			this.router[route.method](route.path, route.func);
		}
	}
}
