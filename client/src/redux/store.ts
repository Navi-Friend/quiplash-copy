import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./game/gameSlice";
import { gameSocketMiddleware } from "./game/gameSocketMiddleware";

const store = configureStore({
  reducer: {
    game: gameReducer,
  },
  middleware: (getDefaultMiddleware) =>
<<<<<<< HEAD
    getDefaultMiddleware().concat(
      gameSocketMiddleware(),
    ),
=======
    getDefaultMiddleware().concat(gameSocketMiddleware()),
>>>>>>> 4232884e57e49db34666d24b5f40adfa7e408675
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
