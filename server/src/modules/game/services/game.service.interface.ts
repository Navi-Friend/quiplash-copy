export default interface IGameService {
	initGame(playerName: string): Promise<void>;
}
