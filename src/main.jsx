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
import Packages from "./HR/Packages";

let router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        loader: () => fetch("http://localhost:3000/packages"),
        Component: Home,
      },
      {
        path: "/login",
        Component: Login,
      },
      { path: "/hr-reg", Component: HRreg },
      {
        path: "/hr-dash",
        element: (
          <PrivateRoute>
            <HRdash></HRdash>
          </PrivateRoute>
        ),
      },
      {
        path: "/assets-list",
        loader: () => fetch("http://localhost:3000/assets"),
        element: (
          <PrivateRoute>
            <AssetsList></AssetsList>
          </PrivateRoute>
        ),
      },
      {
        path: "/add-assets",
        element: (
          <PrivateRoute>
            <AddAssets></AddAssets>
          </PrivateRoute>
        ),
      },
      {
        path: "/request",
        loader: () => fetch("http://localhost:3000/requests"),
        element: (
          <PrivateRoute>
            <Request></Request>
          </PrivateRoute>
        ),
      },
      {
        path: "/ep-list",
        loader: () => fetch("http://localhost:3000/affiliations"),
        element: (
          <PrivateRoute>
            <EPList></EPList>
          </PrivateRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile></Profile>
          </PrivateRoute>
        ),
      },

      { path: "/ep-reg", Component: EPreg },
      {
        path: "/ep-dash",
        element: (
          <PrivateRoute>
            <EPdash></EPdash>
          </PrivateRoute>
        ),
      },
      {
        path: "/assets",
        element: (
          <PrivateRoute>
            <Assets></Assets>
          </PrivateRoute>
        ),
      },
      {
        path: "/my-assets",
        element: (
          <PrivateRoute>
            <MyAssets></MyAssets>
          </PrivateRoute>
        ),
      },
      {
        path: "/my-team",
        element: (
          <PrivateRoute>
            <MyTeam></MyTeam>
          </PrivateRoute>
        ),
      },
      {
        path: "/my-request",
        loader: () => fetch("http://localhost:3000/requests"),
        element: (
          <PrivateRoute>
            <MyRequest></MyRequest>
          </PrivateRoute>
        ),
      },
      {
        path: "/my-profile",
        element: (
          <PrivateRoute>
            <MyProfile></MyProfile>
          </PrivateRoute>
        ),
      },
      {
        path: "/pack",
        loader: () => fetch("http://localhost:3000/packages"),
        element: (
          <PrivateRoute>
            <Packages></Packages>
          </PrivateRoute>
        ),
      },
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
