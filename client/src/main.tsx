import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./lib/routes.ts";
<<<<<<< HEAD
import { Error, Home, PlayersLobby, Rules } from "./pages/index.ts";
=======
import { Error, Home, Rules } from "./pages/index.ts";
>>>>>>> 4232884e57e49db34666d24b5f40adfa7e408675
import { Wrapper } from "./components/layout/Wrapper.tsx";
import { Provider } from "react-redux";
import store from "./redux/store.ts";

const router = createBrowserRouter([
  {
    element: <Wrapper />,
    errorElement: <Error />,
    children: [
      {
        path: routes.home,
        element: <Home />,
<<<<<<< HEAD
=======
        // errorElement: <Error />,
>>>>>>> 4232884e57e49db34666d24b5f40adfa7e408675
      },
      {
        path: routes.rules,
        element: <Rules />,
<<<<<<< HEAD
      },
      {
        path: routes.playersLobby,
        element: <PlayersLobby />,
=======
        // errorElement: <Error />,
>>>>>>> 4232884e57e49db34666d24b5f40adfa7e408675
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
