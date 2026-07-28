import { Outlet } from "react-router-dom";
import MenuLateral from "./MenuLateral";

export default function ProtectedLayout() {
  return (
    <div className="flex h-screen">
      <MenuLateral />

      <main className="flex-1 overflow-auto bg-slate-100 p-8">
        <Outlet />
      </main>
    </div>
  );
}