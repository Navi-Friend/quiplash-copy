import { createServer, Server } from 'http';
import express, { Express } from 'express';
import { injectable } from 'inversify';


@injectable()
export default class HTTPServer {
	private _app: Express;
	private _server: Server;

	constructor() {
		this._app = express();
		this._server = createServer(this.app);
    }

	get app() {
		return this._app;
	}
	get server() {
		return this._server;
	}
}
