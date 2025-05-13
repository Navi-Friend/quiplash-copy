import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./game/gameSlice";
import { gameSocketMiddleware } from "./game/gameSocketMiddleware";
import playerReducer from "@/redux/player/playerSlice";
import { playerSocketMiddleware } from "./player/playerSocketMiddleware";

const store = configureStore({
  reducer: {
    game: gameReducer,
    player: playerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      gameSocketMiddleware(),
      playerSocketMiddleware()
    ),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
