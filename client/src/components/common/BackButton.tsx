import { useAppDispatch } from "@/hooks/redux";
import { Button } from "../ui";
import { To, useNavigate } from "react-router-dom";
import { resetState } from "@/redux/game/gameSlice";

export function BackButton({ path }: { path: To }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <Button
      className="text-xl p-5 hover:scale-110 duration-200"
      onClick={() => {
        dispatch(resetState());
        navigate(path);
      }}
    >
      Назад
    </Button>
  );
}
