import { Container, ContainerModule, ContainerModuleLoadOptions } from 'inversify';
import TYPES from './IoC-types';
import { ISocketExceptionFilter } from './shared/exceptionFilter/socketException.filter.interface';
import { ILoggerService } from './shared/logger/logger.service.interface';
import { LoggerService } from './shared/logger/logger.service';
import { GameService } from './modules/game/services/game/game.service';
import { IGameService } from './modules/game/services/game/game.service.interface';
import { App } from './app';
import { GameSocketController } from './modules/game/socketControllers/game.socket-controller';
import { HTTPServer } from './shared/serverProviders/HTTPServer';
import { SocketServer } from './shared/serverProviders/SocketServer';
import { ISocketController } from './shared/socketControllers/socketController.interface';
import { SocketControllersFactory } from './shared/socketControllers/socketControllerFactory';
import { RedisService } from './shared/redis/redis.service';
import { GameRepository } from './modules/game/redis-repository/game/game.repository';
import { IPlayerRepository } from './modules/game/redis-repository/player/player.repository.interface';
import { PlayerRepository } from './modules/game/redis-repository/player/player.repository';
import { IPlayerService } from './modules/game/services/player/player.service.interface';
import { PlayerService } from './modules/game/services/player/player.service';
import { SocketExceptionFilter } from './shared/exceptionFilter/socketException.filter';
import { IGameRepository } from './modules/game/redis-repository/game/game.repository.interface';
import { IGameOrhestrator } from './modules/game/services/gameOrchestrator.service.interface';
import { GameOrchestrator } from './modules/game/services/gameOrchestrator.service';
import { PrismaService } from './shared/prisma/prisma.service';
import { QuestionRepository } from './modules/game/repository/question.repository';
import { IQuestionRepository } from './modules/game/repository/question.repository.interface';
import { IRoundService } from './modules/game/services/round/round.service.interface';
import { RoundService } from './modules/game/services/round/round.service';

const sharedContainerModule = new ContainerModule(
	(options: ContainerModuleLoadOptions) => {
		options.bind<App>(TYPES.App).to(App);
		options
			.bind<ISocketExceptionFilter>(TYPES.SocketExceptionFilter)
			.to(SocketExceptionFilter)
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
		options.bind<PrismaService>(TYPES.PrismaService).to(PrismaService);
	},
);

const gameContainerModule = new ContainerModule((options: ContainerModuleLoadOptions) => {
	options.bind<ISocketController>(TYPES.SocketController).to(GameSocketController);
	options.bind<IGameService>(TYPES.GameService).to(GameService);
	options
		.bind<IGameRepository>(TYPES.GameRepository)
		.to(GameRepository)
		.inSingletonScope();
	options
		.bind<IPlayerRepository>(TYPES.PlayerRepository)
		.to(PlayerRepository)
		.inSingletonScope();
	options.bind<IPlayerService>(TYPES.PlayerService).to(PlayerService);
	options.bind<IGameOrhestrator>(TYPES.GameOrchestratorService).to(GameOrchestrator);
	options.bind<IQuestionRepository>(TYPES.QuestionRepository).to(QuestionRepository);
	options.bind<IRoundService>(TYPES.RoundService).to(RoundService);
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
