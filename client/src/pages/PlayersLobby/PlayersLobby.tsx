import { useAppSelector } from "@/hooks/redux";
import { BackButton } from "../../components/common/BackButton";
import { Avatar } from "./Avatar";
import { Button } from "@/components/ui";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function PlayersLobby() {
  const gameState = useAppSelector((store) => store.game);

  const handleStartGame = () => {};

  return (
    <>
      <div className="absolute top-6 left-10">
        <BackButton path={routes.home} />
      </div>
      <div
        className={cn(
          "absolute bottom-1/5 left-1/3 transform -translate-x-[70%] text-secondary-foreground rounded-md p-2 w-1/4",
          { "bottom-1/2": gameState.player?.status != "VIP" }
        )}
      >
        <span className="mr-2 font-bold text-2xl text-shadow-[3px_2px_4px_rgb(30,30,30)]">
          Передай код комнаты своим друзьям:
        </span>
        <br />
        <div className="font-mono text-shadow-[7px_6px_4px_rgb(30,30,30)] text-7xl font-bold ">
          {gameState.gameCode || "EMPTY"}
        </div>
        {gameState.player?.status == "VIP" && (
          <div className="mt-20 ml-[-5px]">
            <div className="pb-4 font-bold text-2xl text-shadow-[3px_2px_4px_rgb(30,30,30)]">
              Нажми чтобы начать!
            </div>

            <Button
              className="text-5xl rounded-3xl shadow-[5px_5px_4px_rgb(30,30,30)] font-extrabold p-9 border-black border-3 hover:scale-110"
              onClick={() => handleStartGame()}
            >
              Все здесь
            </Button>
          </div>
        )}
      </div>
      <div className="absolute top-1/2 right-[15%] transform -translate-y-1/2 w-96 h-96 rounded-full">
        {Array.from({ length: 8 }).map((_, index) => {
          return gameState.players[index] ? (
            <div
              key={index}
              style={{ rotate: `${index * (360 / 8)}deg` }}
              className="absolute bottom-80 left-30 origin-[4em_18em]"
            >
              <Avatar
                name={gameState.players[index].playerName}
                isVip={gameState.players[index].status == "VIP"}
                avatarURL={gameState.players[index].avatarURL}
                style={{ rotate: `-${index * (360 / 8)}deg` }}
              />
            </div>
          ) : (
            <div
              key={index}
              style={{ rotate: `${index * (360 / 8)}deg` }}
              className={`w-22 h-22 bg-background-yellow-dark opacity-85 rounded-full flex items-center justify-center absolute bottom-82 left-37 origin-[3em_16em]`}
            >
              <div
                style={{ rotate: `-${index * (360 / 8)}deg` }}
                className="w-19 h-19 border-secondary border-[3.5px] border-dashed rounded-full flex justify-center items-center"
              >
                <span className="text-secondary text-md font-bold">
                  Заходи!
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
