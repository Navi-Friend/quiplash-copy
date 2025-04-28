import { Express, json, urlencoded } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { Server as IOServer } from 'socket.io';
import TYPES from './IoC-types';
import { ILoggerService } from './shared/logger/logger.service.interface';
import cookieParser from 'cookie-parser';
import { instrument } from '@socket.io/admin-ui';
import { HTTPServer } from './shared/serverProviders/HTTPServer';
import { SocketServer } from './shared/serverProviders/SocketServer';
import { SocketControllersFactory } from './shared/socketControllers/socketControllerFactory';
import { RedisService } from './shared/redis/redis.service';
import { PrismaService } from './shared/prisma/prisma.service';

@injectable()
export class App {
	app: Express;
	httpServer: Server;
	io: IOServer;
	port: number = 8000;

	constructor(
		@inject(TYPES.LoggerService) private readonly logger: ILoggerService,
		@inject(TYPES.HTTPServer) httpServer: HTTPServer,
		@inject(TYPES.SocketServer) socketServer: SocketServer,
		@inject(TYPES.SocketControllersFactory)
		private readonly socketControllersFactory: SocketControllersFactory,
		@inject(TYPES.RedisService) private readonly redisService: RedisService,
		@inject(TYPES.PrismaService) private readonly prismaSerivce: PrismaService,
	) {
		this.app = httpServer.app;
		this.httpServer = httpServer.server;
		this.io = socketServer.io;
	}

	useHTTPMiddlewares(): void {
		this.app.use(cookieParser());
		this.app.use(json());
	}

	public async init(): Promise<void> {
		await this.prismaSerivce.connect();
		await this.redisService.connect();
		this.socketControllersFactory.init();
		this.useHTTPMiddlewares();
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
