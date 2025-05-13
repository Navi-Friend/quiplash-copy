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
				origin: ['https://admin.socket.io', 'http://localhost:5173'],
				credentials: true,
			},
		});
	}

	get io(): Server {
		return this._io;
	}
}
