import { IAppError } from './app.error.interface';

export class AppError extends Error implements IAppError {
	public readonly timestamp: string;

	constructor(
		message: string,
		public readonly cause?: Error,
		public readonly details?: unknown,
	) {
		super(message);

		Error.captureStackTrace(this, this.constructor);

		this.name = this.constructor.name;
		this.timestamp = new Date().toISOString();
	}

	public toJSON(): IAppError {
		return {
			name: this.name,
			message: this.message,
			details: this.details,
			timestamp: this.timestamp,
		};
	}

	getServiceInfo(): object {
		return {
			...(this.cause && {
				cause:
					this.cause instanceof AppError
						? this.cause.toJSON()
						: { message: this.cause.message, stack: this.cause.stack },
			}),
			stack: this.stack,
		};
	}
}
