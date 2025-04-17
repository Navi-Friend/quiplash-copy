import { ILoggerService, LogLevel } from './logger.service.interface';
import { injectable } from 'inversify';
import winston, { createLogger, Logger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import config from './logger.config';
import path from 'path';

@injectable()
export class LoggerService implements ILoggerService {
	logger: Logger;
	public readonly level: LogLevel = config.level as LogLevel;
	private readonly levels = config.levels;
	private readonly colors = config.colors;
	private readonly logDir: string = config.dir;
	constructor() {
		this.logger = this.createWinstonLogger();
		this.info('logger successfully created', this);
	}

	private createWinstonLogger(): Logger {
		winston.addColors(this.colors);

		return createLogger({
			level: this.level,
			levels: this.levels,
			transports: [
				new winston.transports.Console({
					format: winston.format.combine(
						winston.format.timestamp(),
						winston.format.colorize({ all: true }),
						winston.format.printf(
							(info) => `${info.timestamp} ${info.level}: ${info.message}`,
						),
					),
				}),
				new winston.transports.File({
					filename: path.join(this.logDir, 'error.log'),
					format: winston.format.combine(
						winston.format.timestamp(),
						winston.format.errors({ stack: true }),
					),
					level: 'error',
				}),
				new DailyRotateFile({
					filename: path.join(this.logDir, 'app-%DATE%.log'),
					datePattern: 'YYYY-MM-DD',
					maxSize: '20m',
					maxFiles: '14d',
					format: winston.format.combine(
						winston.format.timestamp(),
						winston.format.errors({ stack: true }),
						winston.format.json(),
					),
					level: 'debug',
				}),
			],
		});
	}

	debug(message: string, context: unknown): void {
		this.logger.debug(`[${context?.constructor?.name ?? 'Global'}] ${message}`);
	}

	info(message: string, context: unknown): void {
		this.logger.info(`[${context?.constructor?.name ?? 'Global'}] ${message}`);
	}

	warn(message: string, context: unknown): void {
		this.logger.warn(`[${context?.constructor?.name ?? 'Global'}] ${message}`);
	}

	error(message: string, context: unknown): void {
		this.logger.error(`[${context?.constructor?.name ?? 'Global'}] ${message}`);
	}

	log(level: LogLevel, message: string, context: unknown): void {
		this.logger.log(level, `[${context?.constructor?.name ?? 'Global'}] ${message}`);
	}
}
