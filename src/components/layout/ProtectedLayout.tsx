import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

import MenuLateral from "./MenuLateral";

export default function ProtectedLayout() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Menú lateral */}
      <MenuLateral
        abierto={menuAbierto}
        onCerrar={() => setMenuAbierto(false)}
      />

      {/* Contenido principal */}
      <main className="min-w-0 flex-1 overflow-y-auto bg-slate-100">

        {/* Barra superior móvil */}
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white px-4 shadow-sm md:hidden">

          <button
            type="button"
            onClick={() => setMenuAbierto(true)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 transition hover:bg-orange-50 hover:text-orange-600"
            aria-label="Abrir menú"
          >
            <FiMenu size={24} />
          </button>

          <div className="ml-3">
            <p className="text-base font-bold text-slate-800">
              LAGOGRAPHI
            </p>

            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Sistema de Gestión
            </p>
          </div>

        </header>

        <div className="mx-auto w-full max-w-7xl p-4 sm:p-6">
          <Outlet />
        </div>

      </main>

    </div>
  );
}