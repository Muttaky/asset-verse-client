import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Root from "./Root";
import Home from "./Home";
import Login from "./Login";

import HRreg from "./HR/HRreg";
import HRdash from "./HR/HRdash";
import AssetsList from "./HR/AssetsList";
import AddAssets from "./HR/AddAssets";
import Request from "./HR/Request";
import EPList from "./HR/EPList";
import Profile from "./HR/Profile";

import EPreg from "./EP/EPreg";
import EPdash from "./EP/EPdash";
import Assets from "./EP/Assets";
import MyAssets from "./EP/MyAssets";
import MyTeam from "./EP/MyTeam";
import MyRequest from "./EP/MyRequest";
import MyProfile from "./EP/MyProfile";
import AuthProvider from "./AuthProvider";
import PrivateRoute from "./PrivateRoute";

let router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        loader: () => fetch("https://krishi-link-server.vercel.app/crops/"),
        Component: Home,
      },
      {
        path: "/login",
        loader: () => fetch(`https://krishi-link-server.vercel.app/crops/`),
        Component: Login,
      },
      {
        path: "/login/:id",
        loader: async ({ params }) =>
          fetch(`https://krishi-link-server.vercel.app/crops/${params.id}`),
        Component: Login,
      },
      { path: "/hr-reg", Component: HRreg },
      { path: "/hr-dash", Component: HRdash },
      { path: "/assets-list", Component: AssetsList },
      { path: "/add-assets", Component: AddAssets },
      { path: "/request", Component: Request },
      { path: "/ep-list", Component: EPList },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile></Profile>
          </PrivateRoute>
        ),
      },

      { path: "/ep-reg", Component: EPreg },
      { path: "/ep-dash", Component: EPdash },
      { path: "/assets", Component: Assets },
      { path: "/my-assets", Component: MyAssets },
      { path: "/my-team", Component: MyTeam },
      { path: "/my-request", Component: MyRequest },
      { path: "/my-profile", Component: MyProfile },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      {" "}
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
