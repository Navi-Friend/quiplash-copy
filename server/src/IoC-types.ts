const TYPES = {
	App: Symbol.for('Application'),
	ExceptionFilter: Symbol.for('ExceptionFilter'),
	LoggerService: Symbol.for('LoggerService'),
	HTTPServer: Symbol.for('HTTPServer'),
	SocketServer: Symbol.for('SocketServer'),
	SocketController: Symbol.for('SocketController'),
	SocketControllersFactory: Symbol.for('SocketControllersFactory'),
	RedisService: Symbol.for('RedisService'),
	GameService: Symbol.for('GameService'),
	GameRepository: Symbol.for('GameRepository'),
	PlayerRepository: Symbol.for('PlayerRepository'),
	PlayerService: Symbol.for('PlayerService'),
};
export default TYPES;
