import {
	ISocketMiddleware,
	ISocketIONextFN,
} from '../../../shared/middlewares/socket.middleware.interface';
import { Socket } from 'socket.io';

export class AuthPlayer implements ISocketMiddleware {
	execute(socket: Socket, next: ISocketIONextFN): void {
		const data = socket.data;
		if (data?.gameId && data?.roomId) {
			data.authenticated = true;
			next();
		}
	}
}
