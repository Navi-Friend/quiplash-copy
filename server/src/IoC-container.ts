import { Container, ContainerModule, ContainerModuleLoadOptions } from 'inversify';
import TYPES from './IoC-types';
import { IExceptionFilter } from './shared/exceptionFilter/exception.filter.interface';
import { ExceptionFilter } from './shared/exceptionFilter/exception.filter';
import { ILoggerService } from './shared/logger/logger.service.interface';
import { LoggerService } from './shared/logger/logger.service';
import { GameService } from './modules/game/services/game.service';
import { IGameService } from './modules/game/services/game.service.interface';
import { App } from './app';
import { GameSocketController } from './modules/game/socketControllers/game.socket-controller';
import { HTTPServer } from './shared/serverProviders/HTTPServer';
import { SocketServer } from './shared/serverProviders/SocketServer';
import { ISocketController } from './shared/socketControllers/socketController.interface';
import { SocketControllersFactory } from './shared/socketControllers/socketControllerFactory';
import { RedisService } from './shared/redis/redis.service';
import { IGameRepository } from './modules/game/repository/game.repository.interface';
import { GameRepository } from './modules/game/repository/game.repository';
import { IPlayerRepository } from './modules/game/repository/player.repository.interface';
import { PlayerRepository } from './modules/game/repository/player.repository';
import { IPlayerService } from './modules/game/services/player.service.interface';
import { PlayerService } from './modules/game/services/player.service';

const sharedContainerModule = new ContainerModule(
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
		options.bind<HTTPServer>(TYPES.HTTPServer).to(HTTPServer).inSingletonScope();
		options
			.bind<SocketServer>(TYPES.SocketServer)
			.to(SocketServer)
			.inSingletonScope();
		options
			.bind<SocketControllersFactory>(TYPES.SocketControllersFactory)
			.to(SocketControllersFactory);
		options
			.bind<RedisService>(TYPES.RedisService)
			.to(RedisService)
			.inSingletonScope();
	},
);

const gameContainerModule = new ContainerModule((options: ContainerModuleLoadOptions) => {
	options.bind<ISocketController>(TYPES.SocketController).to(GameSocketController);
	options.bind<IGameService>(TYPES.GameService).to(GameService);
	options.bind<IGameRepository>(TYPES.GameRepository).to(GameRepository);
	options.bind<IPlayerRepository>(TYPES.PlayerRepository).to(PlayerRepository);
	options.bind<IPlayerService>(TYPES.PlayerService).to(PlayerService);
});

const appContainer: Container = new Container();
appContainer
	.load(sharedContainerModule, gameContainerModule)
	.then(() => {
		appContainer
			.get<ILoggerService>(TYPES.LoggerService)
			.info('Container succesfully cerated');
	})
	.catch((e) => {
		console.log(e);
	});

export default appContainer;
