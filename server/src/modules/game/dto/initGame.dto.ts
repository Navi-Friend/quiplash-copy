import { IsNotEmpty, IsString } from 'class-validator';

export class InitGameDTO {
	@IsNotEmpty({ message: 'playerName is empty' })
	@IsString({ message: 'playerName is not sent' })
	playerName!: string;
}
