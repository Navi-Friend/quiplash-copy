import { Socket } from 'socket.io';

export interface ISocketExceptionFilter {
	catch: (socket: Socket, error: unknown) => void;
}
