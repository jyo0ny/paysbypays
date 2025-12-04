// src/router/AppRouter.tsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/Dashboard/Dashboard"
import Transactions from "../pages/Transactions/Transactions";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "transactions", element: <Transactions /> },
    ],
  },
]);
