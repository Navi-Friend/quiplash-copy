import { Server } from 'socket.io';
import { inject, injectable } from 'inversify';
import TYPES from '../../IoC-types';
import { HTTPServer } from './HTTPServer';

@injectable()
export class SocketServer {
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

	get io(): Server {
		return this._io;
	}
}
