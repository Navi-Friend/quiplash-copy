import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { useNavigate } from "react-router-dom";
import { GameStartDialog } from "./GameStartDialog";
import { useState } from "react";
<<<<<<< HEAD
=======
import { Input } from "@/components/ui";
>>>>>>> 4232884e57e49db34666d24b5f40adfa7e408675

export function Home() {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
<<<<<<< HEAD
=======

>>>>>>> 4232884e57e49db34666d24b5f40adfa7e408675
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
<<<<<<< HEAD
        <GameStartDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
=======
        <GameStartDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
>>>>>>> 4232884e57e49db34666d24b5f40adfa7e408675

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
