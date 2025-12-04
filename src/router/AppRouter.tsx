// src/router/AppRouter.tsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Payments from "../pages/Payments/Payments";
import Merchants from "../pages/Merchants/Merchants";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "payments", element: <Payments /> },
      { path: "merchants", element: <Merchants /> },
    ],
  },
]);