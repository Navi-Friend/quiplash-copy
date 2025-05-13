export type SocketAction =
  | { type: "game/initGame"; payload: { playerName: string } }
  | {
      type: "game/joinGame";
      payload: { playerName: string; gameCode: string };
    };
