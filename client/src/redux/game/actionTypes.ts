import { PlayerState } from "./gameSlice";

export type GameSocketAction =
  | {
      type: "game/initGame";
      payload: { playerName: string; status: PlayerState["status"] };
    }
  | {
      type: "game/joinGame";
      payload: {
        playerName: string;
        gameCode: string;
        status: PlayerState["status"];
      };
    }
  | {
      type: "game/startGame";
    }
  | {
      type: "game/sendAnswer";
      payload: {
        playerName: string;
        gameCode: string;
        answer: string;
        questionId: number;
        roundId: string;
      };
    }
  | {
      type: "game/questionForVoting";
      payload: {
        questionId: number;
        roundId: string;
        gameCode: string;
      };
    }
  | {
      type: "game/voteForAnswer";
      payload: {
        answerId: string;
        gameCode: string;
        roundId: string;
        playerName: string;
      };
    }
  | {
      type: "game/votingResults";
      payload: {
        roundId: string;
        gameCode: string;
        answerId1: string;
        answerId2: string;
      };
    };
