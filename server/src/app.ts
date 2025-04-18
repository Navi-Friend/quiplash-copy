import { Express, json } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { Server as IOServer } from 'socket.io';
import TYPES from './IoC-types';
import { IExceptionFilter } from './shared/exceptionFilter/exception.filter.interface';
import { ILoggerService } from './shared/logger/logger.service.interface';
import cookieParser from 'cookie-parser';
import { instrument } from '@socket.io/admin-ui';
import { HTTPServer } from './shared/serverProviders/HTTPServer';
import { SocketServer } from './shared/serverProviders/SocketServer';
import { SocketControllersFactory } from './shared/socketControllers/socketControllerFactory';
import { RedisService } from './shared/redis/redis.service';

@injectable()
export class App {
	app: Express;
	httpServer: Server;
	io: IOServer;
	port: number = 8000;

	constructor(
		@inject(TYPES.LoggerService) private readonly logger: ILoggerService,
		@inject(TYPES.ExceptionFilter) private readonly exceptionFilter: IExceptionFilter,
		@inject(TYPES.HTTPServer) httpServer: HTTPServer,
		@inject(TYPES.SocketServer) socketServer: SocketServer,
		@inject(TYPES.SocketControllersFactory)
		private readonly socketControllersFactory: SocketControllersFactory,
		@inject(TYPES.RedisService) private readonly redisService: RedisService,
	) {
		this.app = httpServer.app;
		this.httpServer = httpServer.server;
		this.io = socketServer.io;
	}

	useHTTPMiddlewares(): void {
		this.app.use(cookieParser());
		this.app.use(json());
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		await this.redisService.connect();
		this.socketControllersFactory.init();
		this.useHTTPMiddlewares();
		this.useExceptionFilters();
		this.httpServer.listen(this.port, () => {
			this.logger.info(`Server started on ${this.port}`, this);
		});

		instrument(this.io, {
			auth: false, // Отключить аутентификацию для разработки
			mode: 'development',
		});
	}

	public async close(): Promise<void> {
		this.httpServer?.close();
		await this.io.close();
	}
}
