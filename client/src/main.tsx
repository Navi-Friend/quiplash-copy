import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./lib/routes.ts";
import {
  Error,
  Home,
  PlayersLobby,
  Rules,
  VotingPage,
  AnswerPage,
  Leaderboard,
} from "./pages/index.ts";
import { Wrapper } from "./components/layout/Wrapper.tsx";
import { Provider } from "react-redux";
import store from "./redux/store.ts";
import { Bounce, ToastContainer } from "react-toastify";

const router = createBrowserRouter([
  {
    element: <Wrapper />,
    errorElement: <Error />,
    children: [
      {
        path: routes.home,
        element: <Home />,
      },
      {
        path: routes.rules,
        element: <Rules />,
      },
      {
        path: routes.playersLobby,
        element: <PlayersLobby />,
      },
      {
        path: routes.answerPage,
        element: <AnswerPage />,
      },
      {
        path: routes.vote,
        element: <VotingPage />,
      },
      {
        path: routes.leaderboard,
        element: <Leaderboard />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        limit={1}
        stacked={false}
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
