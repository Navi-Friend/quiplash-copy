import { IAppError } from '../app/app.error.interface';

export interface IHTTPError extends IAppError {
	statusCode: number;
}
