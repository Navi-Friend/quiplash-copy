export interface IAppError{
    name: string,
    message: string,
	timestamp: string;
	cause?: Error;
	details?: unknown;
}
