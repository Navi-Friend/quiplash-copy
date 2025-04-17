import { Container, ContainerModule, ContainerModuleLoadOptions } from 'inversify';
import TYPES from './container-types';
import { IExceptionFilter } from './shared/exceptionFilter/exception.filter.interface';
import { ExceptionFilter } from './shared/exceptionFilter/exception.filter';
import { ILoggerService } from './shared/logger/logger.service.interface';
import { LoggerService } from './shared/logger/logger.service';
import IGameController from './modules/game/controllers/game.controller.interface';
import GameController from './modules/game/controllers/game.controller';
import GameService from './modules/game/services/game.service';
import IGameService from './modules/game/services/game.service.interface';
import App from './app';
import GameHandler from './modules/game/handlers/game.handler';
import HTTPServer from './shared/utils/HTTPServer';
import SocketIOServer from './shared/utils/SocketIOServer';
import SocketHandlerManager from './shared/socketHandlerManager/socketHandlerManager';

const sharedContainerModule: ContainerModule = new ContainerModule(
	(options: ContainerModuleLoadOptions) => {
		options.bind<App>(TYPES.App).to(App);
		options
			.bind<IExceptionFilter>(TYPES.ExceptionFilter)
			.to(ExceptionFilter)
			.inSingletonScope();
		options
			.bind<ILoggerService>(TYPES.LoggerService)
			.to(LoggerService)
			.inSingletonScope();
		options.bind<IGameController>(TYPES.GameController).to(GameController);
		options.bind<IGameService>(TYPES.GameService).to(GameService);
		options
			.bind<SocketHandlerManager>(TYPES.SocketHandlerManager)
			.to(SocketHandlerManager)
			.inSingletonScope();
		options.bind<GameHandler>(TYPES.GameHandler).to(GameHandler);
		options.bind<HTTPServer>(TYPES.HTTPServer).to(HTTPServer).inSingletonScope();
		options
			.bind<SocketIOServer>(TYPES.SocketIOServer)
			.to(SocketIOServer)
			.inSingletonScope();
	},
);

// Socket and http containers or module containers

const appContainer: Container = new Container();
appContainer
	.load(sharedContainerModule)
	.then(() => {
		appContainer
			.get<ILoggerService>(TYPES.LoggerService)
			.info('Container succesfully cerated');
	})
	.catch((e) => {
		console.log(e);
	});

export default appContainer;
