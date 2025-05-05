import { IsNotEmpty, IsString } from 'class-validator';

export class VotingDTO {
	@IsString({ message: 'roundId is not string' })
	roundId!: string;

	@IsNotEmpty({ message: 'gameCode is empty' })
	@IsString({ message: 'gameCode is not string' })
	gameCode!: string;

	@IsNotEmpty({ message: 'playerName is empty' })
	@IsString({ message: 'playerName is not string' })
	playerName!: string;

	@IsString({ message: 'answerId is not string' })
	answerId!: string;
}
