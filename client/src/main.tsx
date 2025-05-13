import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./lib/routes.ts";
import { Error, Home, Rules } from "./pages/index.ts";
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
        // errorElement: <Error />,
      },
      {
        path: routes.rules,
        element: <Rules />,
        // errorElement: <Error />,
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
