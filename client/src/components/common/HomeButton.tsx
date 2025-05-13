import { useNavigate } from "react-router-dom";
import { Button } from "../ui";
import { routes } from "@/lib/routes";

export function HomeButton() {
  const navigate = useNavigate()
  return (
    <Button
      size="lg"
      className="text-2xl my-6 max-w-2xl w-full p-6"
      onClick={() => navigate(routes.home)}
    >
      Назад
    </Button>
  );
}
