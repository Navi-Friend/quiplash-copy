import { inject, injectable } from 'inversify';
import { ILoggerService } from '../logger/logger.service.interface';
import TYPES from '../../IoC-types';
import { AppError } from '../errors/app/app.error';
import { AppValidationError } from '../../modules/game/errors/validation.error';
import { Socket } from 'socket.io';
import { ISocketExceptionFilter } from './socketException.filter.interface';

@injectable()
export class SocketExceptionFilter implements ISocketExceptionFilter {
	constructor(@inject(TYPES.LoggerService) private readonly logger: ILoggerService) {}

	catch(socket: Socket, error: unknown): void {
		if (error instanceof AppValidationError) {
			this.logger.error('Validation error:', this);
			socket.emit('error', error);
			// 	this.logger.error(
			// 		JSON.stringify({ ...err, ...err.getServiceInfo() }, null, 2),
			// 		this,
			// 	);
			// 	res.status(err.statusCode).json({ error: err });
			// } else {
			// }
		}
	}
}
