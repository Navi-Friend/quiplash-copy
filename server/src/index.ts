import App from './app';
import appContainer from './container';
import TYPES from './container-types';

async function main(): Promise<void> {
	const app: App = appContainer.get<App>(TYPES.App);
	await app.init();
}

export const app = main();
