import { IsNotEmpty, IsString } from 'class-validator';

export class StartGameDTO {
	@IsNotEmpty({ message: 'gameCode is empty' })
	@IsString({ message: 'gameCode is not string' })
	gameCode!: string;
}
