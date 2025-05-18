import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { motion } from "framer-motion";
import { Avatar } from "@/components/common";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { routes } from "@/lib/routes";
import { resetState } from "@/redux/game/gameSlice";

export function Leaderboard() {
  const gameState = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const sortedPlayers = [...gameState.players].sort(
    (a, b) => b.score - a.score
  );

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-7xl font-bold text-shadow-[7px_6px_4px_rgb(30,30,30)] mb-16 text-amber-50"
      >
        Итоги игры
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-2xl space-y-6 px-4"
      >
        {sortedPlayers.map((player, index) => (
          <motion.div
            key={player.playerName}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={cn(
              "flex items-center gap-6 p-6 rounded-2xl border-4 border-black",
              "bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
              "hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]",
              "transition-all duration-200"
            )}
          >
            <div className="text-4xl font-bold w-12 text-center">
              {index + 1}
            </div>
            <Avatar avatarURL={player.avatarURL} className="w-20 h-20" />
            <div className="flex-1">
              <div className="text-2xl font-bold">{player.playerName}</div>
              <div className="text-lg text-gray-600 font-medium">
                {player.status === "VIP" ? "VIP игрок" : "Игрок"}
              </div>
            </div>
            <div className="text-4xl font-bold text-chart-2">
              {player.score}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-12"
      >
        <Button
          onClick={() => {
            navigate(routes.home);
            dispatch(resetState());
          }}
          className="text-2xl px-10 py-7 bg-primary border-3 border-black rounded-2xl! active:scale-91"
        >
          В главное меню
        </Button>
      </motion.div>
    </div>
  );
}
