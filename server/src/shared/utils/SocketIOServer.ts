import { Server } from 'socket.io';
import { Server as httpServer } from 'http';
import { inject, injectable } from 'inversify';
import TYPES from '../../container-types';
import HTTPServer from './HTTPServer';

@injectable()
export default class SocketIOServer {
	private _io: Server;

	constructor(@inject(TYPES.HTTPServer) httpServer: HTTPServer) {
		this._io = new Server(httpServer.server, {
			cors: {
				origin: ['https://admin.socket.io'],
				// ["https://admin.socket.io"],
				credentials: true,
			},
		});
	}

	get io() {
		return this._io;
	}
}
