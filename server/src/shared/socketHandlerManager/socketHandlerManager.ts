import { Namespace, Server, Socket } from 'socket.io';
import ISocketHandlerManager from './socketHandlerManager.interface';
import ISocketRoute from './socketRoute.interface';
import { injectable } from 'inversify';

@injectable()
export default class SocketHandlerManager implements ISocketHandlerManager {
	private _io: Server;
	constructor(io: Server) {
		this._io = io;
		console.log('SocketHandler created');
	}

	get io() {
		return this._io;
	}

	private bindNamespace(route: ISocketRoute, server: Server): Namespace {
		console.log('namespace');
		return server.of(route.namespace);
	}

	private bindMiddlewares(route: ISocketRoute, server: Namespace | Server): void {
		console.log('middlewares');

		if (route.middlewares?.length) {
			for (const middleware of route.middlewares) {
				server.use(middleware.execute);
			}
		}
	}

	private bindRooms(route: ISocketRoute, server: Namespace | Server): void {
		console.log('rooms');

		if (route.rooms?.length) {
			for (const room of route.rooms) {
				server.in(room);
			}
		}
	}

	private bindExcept(route: ISocketRoute, server: Server | Namespace): void {
		console.log('except');

		if (route.except) {
			server.except(route.except);
		}
	}

	private bindFunc(route: ISocketRoute, server: Server | Namespace): void {
		console.log('func');

		server.on('connection', route.func)
	}

	bindRoutes(routes: ISocketRoute[]) {
		for (const route of routes) {
			const orderNamespace = this.bindNamespace(route, this._io);
			this.bindMiddlewares(route, orderNamespace);
			this.bindRooms(route, orderNamespace);
			this.bindExcept(route, orderNamespace);
			this.bindFunc(route, orderNamespace);
		}
	}
}
