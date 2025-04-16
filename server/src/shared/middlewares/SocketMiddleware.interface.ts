import { ExtendedError, Socket } from 'socket.io';

export default interface ISocketMiddleware {
	execute: (socket: Socket, next: (err?: ExtendedError | undefined) => void) => void;
}
