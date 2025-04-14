import { Container, ContainerModule, ContainerModuleLoadOptions } from 'inversify';
import TYPES from './container-types';
import App from './app';
import { IExceptionFilter } from './shared/exceptionFilter/exception.filter.interface';
import { ExceptionFilter } from './shared/exceptionFilter/exception.filter';
import { ILoggerService } from './shared/logger/logger.service.interface';
import { LoggerService } from './shared/logger/logger.service';
import IGameController from './modules/game/controllers/game.controller.interface';
import GameController from './modules/game/controllers/game.controller';
import GameService from './modules/game/services/game.service';
import IGameService from './modules/game/services/game.service.interface';

const sharedContainerModule: ContainerModule = new ContainerModule(
	(options: ContainerModuleLoadOptions) => {
		options.bind<App>(TYPES.App).to(App).inSingletonScope();
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
