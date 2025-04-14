import { AppError } from '../app/app.error';
import { IHTTPError } from './HTTP.error.interface';

export class HTTPError extends AppError implements IHTTPError {
	constructor(
		message: string,
		public readonly statusCode: number = 500,
		cause?: Error,
		details?: unknown,
	) {
		super(message, cause, details);
	}

	public toJSON(): IHTTPError {
		return {
			name: this.name,
			statusCode: this.statusCode,
			message: this.message,
			details: this.details,
			timestamp: this.timestamp,
		};
	}
}
