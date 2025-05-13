import { io } from "socket.io-client";

export const socket = io("localhost:8000", { withCredentials: true });

socket.on("connect", () => {
  console.log(socket.id);
});
