// src/layout/MainLayout.tsx
import { Outlet, NavLink } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex h-screen">
      <aside className="w-60 bg-gray-900 text-white p-6">
        <h1 className="text-xl font-bold mb-6">Pays Dashboard</h1>

        <nav className="flex flex-col gap-3">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg transition ${
                isActive ? "bg-blue-600 text-white" : "hover:bg-gray-800"
              }`
            }
          >
            📊 대시보드
          </NavLink>
          <NavLink
            to="/payments"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg transition ${
                isActive ? "bg-blue-600 text-white" : "hover:bg-gray-800"
              }`
            }
          >
            💳 결제 내역
          </NavLink>
          <NavLink
            to="/merchants"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg transition ${
                isActive ? "bg-blue-600 text-white" : "hover:bg-gray-800"
              }`
            }
          >
            🏪 가맹점 관리
          </NavLink>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-50 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}