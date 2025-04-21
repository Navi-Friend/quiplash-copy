import { AppError } from '../../../shared/errors/app/app.error';
import { IAppValidationError } from './validation.error.interface';

export class AppValidationError extends AppError implements IAppValidationError {
	constructor(
		message: string,
		public invalidData: unknown,
		cause?: Error,
		details?: unknown,
	) {
		super(message, cause, details);
	}
}
