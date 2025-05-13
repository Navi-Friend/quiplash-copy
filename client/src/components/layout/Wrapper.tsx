import { Outlet } from "react-router-dom";

export function Wrapper() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-800 via-purple-800 to-purple-700">
      <div className="min-h-screen container m-auto flex flex-col items-center justify-center p-4">
        <Outlet/>
      </div>
    </div>
  );
}
