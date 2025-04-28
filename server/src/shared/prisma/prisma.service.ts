import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import TYPES from '../../IoC-types';
import { LoggerService } from '../logger/logger.service';

@injectable()
export class PrismaService {
	client: PrismaClient;

	constructor(@inject(TYPES.LoggerService) private readonly logger: LoggerService) {
		this.client = new PrismaClient();
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.info('Prisma service is connected', this);
		} catch (error) {
			this.logger.info('Prisma service connection error', this);
		}
	}

	async disconnect(): Promise<void> {
		try {
			await this.client.$disconnect();
			this.logger.info('Prisma service is disconnected', this);
		} catch (error) {
			this.logger.info('Prisma service disconnection error', this);
		}
	}
}
