import { Router } from 'express';
import IBaseHTTPController from './baseController.interface';
import IHTTPRoute from './route.interface';
import { inject, injectable } from 'inversify';
import TYPES from '../../container-types';
import { ILoggerService } from '../logger/logger.service.interface';

@injectable()
export default abstract class BaseHTTPController implements IBaseHTTPController {
	router: Router;
	constructor(@inject(TYPES.LoggerService) protected readonly logger: ILoggerService) {
		this.router = Router();
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
