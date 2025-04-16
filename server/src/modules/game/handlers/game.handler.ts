import { inject, injectable } from 'inversify';
import TYPES from '../../../container-types';
import ISocketHandlerManager from '../../../shared/socketHandlerManager/socketHandlerManager.interface';
import { Socket } from 'socket.io';

@injectable()
export default class GameHandler {
	constructor(
		@inject(TYPES.SocketHandlerManager) private manager: ISocketHandlerManager,
	) {
		console.log('asdfasdfsdafsadfasdf');
		this.manager.bindRoutes([
			{
				func: this.handler.bind(this),
				namespace: '/a',
			},
		]);
	}

	handler(socket: Socket) {
		socket.on('asdf', () => {
			console.log('asdf');
			socket.emit('echo-asdf');
		});
	}
}
