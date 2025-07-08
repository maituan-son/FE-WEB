import { createBrowserRouter } from "react-router-dom";
import clienRoutes from "./clienRoutes";

import LayoutAdmin from "../components/Layout/LayoutAdmin";
import LayoutClient from "../components/Layout/LayoutClien";

import Login from "../page/Login";

import NotFound from "../components/NotFound";
import AdminRoute from "./adminRole";
import adminRoutes from "./adminRoutes";
import AdminRole from "./adminRole";

const routerApp = createBrowserRouter([
  //layout Clien
  {
    path: "/",
    element: <LayoutClient />,
    children: clienRoutes,
  },
  //layout Admin
  {
    path: "/admin",
    element: <AdminRole />,
    children: [
      {
        path: "",
        element: <LayoutAdmin />, // layout của admin
        children: adminRoutes,
      },
    ],
  },
  //layout Empty
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routerApp;
