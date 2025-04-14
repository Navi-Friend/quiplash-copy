import { createClient } from 'redis';

const redisClient = createClient({ url: 'redis://localhost:6379' });

export default redisClient;
