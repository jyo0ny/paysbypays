// src/layout/MainLayout.tsx
import { Outlet, NavLink } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-900 text-white p-6">
        <h1 className="text-xl font-bold mb-6">Pays Dashboard</h1>

        <nav className="flex flex-col gap-3">
          <NavLink to="/" className="hover:text-blue-400">대시보드</NavLink>
          <NavLink to="/transactions" className="hover:text-blue-400">거래 내역</NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
