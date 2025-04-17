import { inject, injectable } from 'inversify';
import TYPES from '../../../container-types';
import ISocketHandlerManager from '../../../shared/socketHandlerManager/socketHandlerManager.interface';
import { Socket } from 'socket.io';

@injectable()
export default class GameHandler {
	constructor(
		@inject(TYPES.SocketHandlerManager) private manager: ISocketHandlerManager,
	) {
		this.manager.bindRoutes([
			{
				func: this.handler,
				namespace: '/',
			},
		]);
	}

	handler(socket: Socket): void {
		socket.on('joinRoom', () => {
			console.log('asdf');
			socket.emit('echo-asdf');
		});
	}
}
