import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { useNavigate } from "react-router-dom";
import { GameStartDialog } from "./GameStartDialog";
import { useState } from "react";

export function Home() {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <div>
      <h1 className="text-6xl font-bold text-white mb-8 animate-bounce">
        Quiplash
      </h1>

      <div className="space-y-4 flex flex-col">
        <Button
          size="lg"
          className={"w-64 h-16 text-xl font-bold"}
          onClick={() => setIsDialogOpen(true)}
        >
          Играть
        </Button>
        <GameStartDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />

        <Button
          size="lg"
          className="w-64 h-16 text-xl font-bold"
          onClick={() => navigate(routes.rules)}
        >
          Правила
        </Button>
      </div>
    </div>
  );
}
