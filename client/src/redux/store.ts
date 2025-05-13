import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./game/gameSlice";
import { gameSocketMiddleware } from "./game/gameSocketMiddleware";

const store = configureStore({
  reducer: {
    game: gameReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(gameSocketMiddleware()),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
