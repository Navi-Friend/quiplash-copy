import { IsNotEmpty, IsString } from 'class-validator';

export class CalcAnswerPointsDTO {
	@IsString({ message: 'roundId is not string' })
	roundId!: string;

	@IsNotEmpty({ message: 'gameCode is empty' })
	@IsString({ message: 'gameCode is not string' })
	gameCode!: string;

	@IsString({ message: 'answerId1 is not string' })
	answerId1!: string;

	@IsString({ message: 'answerId2 is not string' })
	answerId2!: string;
}
