/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Express, json } from 'express';
import { createServer, Server } from 'http';
import { inject, injectable } from 'inversify';
import { Server as SocketServer } from 'socket.io';
import TYPES from './container-types';
import { IExceptionFilter } from './shared/exceptionFilter/exception.filter.interface';
import { ILoggerService } from './shared/logger/logger.service.interface';
import IGameController from './modules/game/controllers/game.controller.interface';
import cookieParser from 'cookie-parser';
// import appContainer from './container';
// import SocketHandlerManagerWrapper from './shared/socketHandlerManager/socketHandlerManagerWrapper';
import GameHandler from './modules/game/handlers/game.handler';
import appContainer from './container';
import SocketHandlerManager from './shared/socketHandlerManager/socketHandlerManager';
import { instrument } from '@socket.io/admin-ui';

@injectable()
export default class App {
	app: Express;
	httpServer: Server;
	io: SocketServer;
	port: number = 8000;

	constructor(
		@inject(TYPES.LoggerService) private readonly logger: ILoggerService,
		@inject(TYPES.ExceptionFilter) private readonly exceptionFilter: IExceptionFilter,
		@inject(TYPES.GameController) private readonly gameController: IGameController,
		// @inject(TYPES.GameHandler) private readonly gameHandler: GameHandler,
	) {
		this.app = express();
		this.httpServer = createServer(this.app);
		this.io = new SocketServer(this.httpServer, {
			cors: {
				origin: ['https://admin.socket.io'],
				// ["https://admin.socket.io"],
				credentials: true,
			},
		});

		appContainer
			.bind<SocketHandlerManager>(TYPES.SocketHandlerManager)
			.toConstantValue(new SocketHandlerManager(this.io));

		appContainer.get<GameHandler>(TYPES.GameHandler);
	}

	useHTTPMiddlewares(): void {
		this.app.use(cookieParser());
		this.app.use(json());
	}

	useRoutes(): void {
		this.app.get('/api/data', (req, res) => {
			res.json({ message: 'HTTP response' });
		});
		this.app.use('/user', this.gameController.router);
	}

	useEvents(): void {
		this.io.on('connection', (socket) => {
			console.log('New client connected ', socket.id);
			console.log('initial transport', socket.conn.transport.name);
			socket.on('message', (data) => {
				console.log('Message received:', data);
				this.io.emit('response', { message: 'Socket.IO response' });
			});
			socket.emit('mes_res', () => {});
		});
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useHTTPMiddlewares();
		this.useEvents();
		this.useRoutes();
		this.useExceptionFilters();
		console.log(
			appContainer
				.get<SocketHandlerManager>(TYPES.SocketHandlerManager)
				.io.listeners.toString(),
		);
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
