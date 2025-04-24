import { IsNotEmpty, IsString } from 'class-validator';

export class JoinGameDTO {
	@IsNotEmpty({ message: 'playerName is empty' })
	@IsString({ message: 'playerName is not string' })
	playerName!: string;

	@IsNotEmpty({ message: 'gameCode is empty' })
	gameCode!: string;
}
