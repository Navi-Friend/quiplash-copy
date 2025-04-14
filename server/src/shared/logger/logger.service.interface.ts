export interface ILoggerService {
	logger: unknown; // may be Logger of winston, tslog or whatever
	debug: (message: string, context?: unknown) => void;
	info: (message: string, context?: unknown) => void;
	warn: (message: string, context?: unknown) => void;
	error: (message: string, context?: unknown) => void;
	log(level: LogLevel, message: string, context?: unknown): void;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
