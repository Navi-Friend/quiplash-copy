import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { AppValidationError } from '../errors/validation.error';

export class ValidateMiddleware {
	static async validateDTO(
		dtoClass: ClassConstructor<object>,
		data: unknown,
	): Promise<Error[]> {
		let errors: Error[] = [];
		if (!data) {
			errors.push(new AppValidationError('Data is not provided', data || {}));
		}
		const instance = plainToClass(dtoClass, data);
		const classValidatorErrors = await validate(instance);

		if (classValidatorErrors.length) {
			const message = classValidatorErrors
				.map((e) => Object.values(e.constraints || {}))
				.flat()
				.join('; ');

			errors.push(
				new AppValidationError('Invalid data', data || {}, undefined, message),
			);
		}
		return errors;
	}
}
