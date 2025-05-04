export abstract class BaseRedisRepository {
	constructor() {}
	protected modelToRedisHash<T extends object>(
		entity: T,
	): Record<string, string | number> {
		const obj: Record<string, string | number> = {};
		Object.entries(entity).map(([key, value]) => {
			if (typeof value === 'string') {
				obj[key] = value;
			}
			if (typeof value === 'number') {
				obj[key] = Number(value);
			}
		});
		return obj;
	}
}
