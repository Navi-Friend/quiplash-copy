import { IAppError } from '../../../shared/errors/app/app.error.interface';

export interface IAppValidationError extends IAppError {
	invalidData: unknown;
}
