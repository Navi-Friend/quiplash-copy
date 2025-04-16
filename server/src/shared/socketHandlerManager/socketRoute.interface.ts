import { NextFunction } from 'express';
import { Socket, Namespace } from 'socket.io';
import ISocketMiddleware from '../middlewares/SocketMiddleware.interface';

export default interface ISocketRoute {
	namespace: string;
	middlewares?: ISocketMiddleware[];
	except?: string;
	rooms?: string[];
	func: (socket: Socket, next?: NextFunction) => void;
}
