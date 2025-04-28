import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AnswerQuestionDTO {
	@IsNotEmpty({ message: 'playerName is empty' })
	@IsString({ message: 'playerName is not string' })
	playerName!: string;

	@IsNotEmpty({ message: 'gameCode is empty' })
	gameCode!: string;

	@IsString({ message: 'answer is not string' })
	answer!: string;

	@IsInt({ message: 'questionId is not number' })
	questionId!: number;
}
