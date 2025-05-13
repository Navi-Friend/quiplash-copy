import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/";
import { Button } from "@/components/ui/";
import { Input } from "@/components/ui/";
import { useAppDispatch } from "@/hooks/redux";
import { SocketAction } from "@/redux/game/actionTypes";

interface CustomDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GameStartDialog({ isOpen, onOpenChange }: CustomDialogProps) {
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const handleCreateRoom = () => {
    dispatch<SocketAction>({
      type: "game/initGame",
      payload: { playerName } as { playerName: string },
    });
  };

  const handleJoinRoom = () => {
    if (roomCode.length === 4) {
      // TODO: Implement room joining logic
      // navigate(routes.game);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-purple-900">
            Присоединиться к игре
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-8 py-4">
          <div>
            <label htmlFor="player-name-input" className="text-lg font-medium">
              Имя:
            </label>
            <Input
              className="bg-white"
              id="player-name-input"
              type="text"
              onChange={(e) => setPlayerName(e.target.value)}
            ></Input>
          </div>
          <div className="space-y-10">
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Создать новую комнату</h3>
              <Button
                disabled={!playerName}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg p-5"
                onClick={handleCreateRoom}
              >
                Создать комнату
              </Button>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Присоединиться к комнате</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Q4ZW"
                  maxLength={4}
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="text-center text-xl tracking-widest"
                />
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={handleJoinRoom}
                  disabled={roomCode.length !== 4 || !playerName}
                >
                  Войти
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
