import { inject, injectable, multiInject } from 'inversify';
import TYPES from '../../IoC-types';
import { SocketServer } from '../serverProviders/SocketServer';
import { ISocketController } from './socketController.interface';

@injectable()
export class SocketControllersFactory {
	constructor(
		@inject(TYPES.SocketServer) private readonly server: SocketServer,
		@multiInject(TYPES.SocketController)
		public readonly controllers: ISocketController[],
	) {
		console.log(this.controllers);
	}

	init(): void {
		this.server.io.on('connection', (socket) => {
			this.controllers.forEach((c) => {
				c.registerHandlers.call(c, socket, this.server.io);
			});
		});
	}
}
