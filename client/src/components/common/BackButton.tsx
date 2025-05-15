import { Button } from "../ui";
import { To, useNavigate } from "react-router-dom";

export function BackButton({ path }: { path: To }) {
  const navigate = useNavigate();
  return (
    <Button
      className="text-xl p-5 hover:scale-110 duration-200"
      onClick={(e) => {
        e.preventDefault(); // ← Важно!
        navigate(path);
      }}
    >
      Назад
    </Button>
  );
}
