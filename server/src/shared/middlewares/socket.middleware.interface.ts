import { ExtendedError, Socket } from 'socket.io';

export interface ISocketMiddleware {
	execute: (socket: Socket, next: ISocketIONextFN) => void;
}

export type ISocketIONextFN = (err?: ExtendedError | undefined) => void;
