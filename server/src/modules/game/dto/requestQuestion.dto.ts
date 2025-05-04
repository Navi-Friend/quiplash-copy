import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class RequestQuestionForVotingDTO {
	@IsInt({ message: 'questionId must be non emty int value' })
	questionId!: number;

	@IsString({ message: 'roundId is not string' })
	roundId!: string;

	@IsNotEmpty({ message: 'gameCode is empty' })
	@IsString({ message: 'gameCode is not string' })
	gameCode!: string;
}
