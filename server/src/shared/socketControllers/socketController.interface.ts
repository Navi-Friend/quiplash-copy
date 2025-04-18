import { Server, Socket } from 'socket.io';

export interface ISocketController {
	registerHandlers: (socket: Socket, io: Server) => void;
}
