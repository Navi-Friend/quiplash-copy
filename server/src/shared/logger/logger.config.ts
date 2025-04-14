import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export default {
	level: (process.env.NODE_ENV ?? 'development' === 'development') ? 'debug' : 'warn',
	dir: process.env.LOG_DIR ?? path.join(__dirname, '../../../logs'),
	levels: {
		error: 0,
		warn: 1,
		info: 2,
		debug: 3,
	},
	colors: {
		error: 'red',
		warn: 'yellow',
		info: 'green',
		debug: 'white',
	},
};
