import { Server } from 'socket.io';
import ISocketRoute from './socketRoute.interface';

export default interface ISocketHandlerManager {
	io: Server;
	bindRoutes: (routes: ISocketRoute[]) => void;
}
