export abstract class BaseRedisRepository {
	constructor() {}
	protected modelToRedisHash<T extends object>(entity: T): Record<string, string> {
		const obj: Record<string, string> = {};
		Object.entries(entity).map(([key, value]) => (obj[key] = value));
		return obj;
	}
}
