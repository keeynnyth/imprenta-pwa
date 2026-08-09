
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../contexts/AuthContext";

import logo from "../../assets/images/logo.png";

import {
  FiHome,
  FiPackage,
  FiUsers,
  FiClipboard,
  FiTool,
  FiBarChart2,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiUser,
  FiDollarSign,
  FiX,
} from "react-icons/fi";

interface MenuLateralProps {
  abierto?: boolean;
  onCerrar?: () => void;
}

function MenuLateral({
  abierto = false,
  onCerrar,
}: MenuLateralProps) {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  const claseMenu = ({
    isActive,
  }: {
    isActive: boolean;
  }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
      isActive
        ? "bg-orange-600 font-semibold text-white shadow-sm"
        : "text-white hover:bg-orange-500"
    }`;

  return (
    <>
      {/* Overlay móvil */}
      {abierto && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={onCerrar}
          className="fixed inset-0 z-40 bg-slate-950/50 md:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col
          bg-slate-900 text-white
          transition-transform duration-300 ease-in-out
          md:static md:z-auto md:translate-x-0
          ${abierto ? "translate-x-0" : "-translate-x-full"}
        `}
      >

        {/* Logo */}
        <div className="flex h-28 shrink-0 flex-col items-center justify-center border-b border-slate-700 bg-orange-600 px-4">

          <div className="flex items-center justify-center">
            <img
              src={logo}
              alt="LAGOGRAPHI"
              className="h-12 w-auto object-contain"
            />
          </div>

          <p className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-900">
            Sistema de Gestión
          </p>

        </div>

        {/* Botón cerrar móvil */}
        <div className="flex items-center justify-end px-4 pt-3 md:hidden">
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-lg p-2 text-slate-300 transition hover:bg-orange-600 hover:text-white"
            aria-label="Cerrar menú"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Menú */}
        <nav
          onClick={onCerrar}
          className="flex-1 overflow-y-auto px-4 py-6"
        >

          {/* PRINCIPAL */}
          <p className="mb-3 px-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-orange-400">
            PRINCIPAL
          </p>

          <ul className="space-y-1">

            <li>
              <NavLink
                to="/dashboard"
                className={claseMenu}
              >
                <FiHome size={16} />
                Inicio
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/productos"
                className={claseMenu}
              >
                <FiPackage size={16} />
                Productos
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/clientes"
                className={claseMenu}
              >
                <FiUsers size={16} />
                Clientes
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/cotizaciones"
                className={claseMenu}
              >
                <FiClipboard size={16} />
                Cotizaciones
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/ordenes-trabajo"
                className={claseMenu}
              >
                <FiTool size={16} />
                Órdenes de Trabajo
              </NavLink>
            </li>

            {/* TASAS: visible para todos */}
            <li>
              <NavLink
                to="/tasas"
                className={claseMenu}
              >
                <FiDollarSign size={16} />
                Tasas
              </NavLink>
            </li>

          </ul>

          {/* FINANZAS */}
          {usuario?.rol === "admin" && (
            <>
              <div className="my-6 border-t border-orange-900/40" />

              <p className="mb-3 px-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-orange-400">
                FINANZAS
              </p>

              <ul className="space-y-1">

                <li>
                  <NavLink
                    to="/finanzas"
                    className={claseMenu}
                  >
                    <FiBarChart2 size={16} />
                    Dashboard
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/finanzas/movimientos"
                    className={claseMenu}
                  >
                    <FiFileText size={16} />
                    Movimientos
                  </NavLink>
                </li>

              </ul>
            </>
          )}

          {/* SISTEMA */}
          <div className="my-6 border-t border-orange-900/40" />

          <p className="mb-3 px-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-orange-400">
            SISTEMA
          </p>

          <ul className="space-y-1">

            {usuario?.rol === "admin" && (
              <li>
                <NavLink
                  to="/usuarios"
                  className={claseMenu}
                >
                  <FiUser size={16} />
                  Usuarios
                </NavLink>
              </li>
            )}

            <li>
              <NavLink
                to="/configuracion"
                className={claseMenu}
              >
                <FiSettings size={16} />
                Configuración
              </NavLink>
            </li>

          </ul>

        </nav>

        {/* Footer */}
        <div
          className="shrink-0 border-t border-slate-700 p-4"
          onClick={onCerrar}
        >
          <button
            type="button"
            onClick={cerrarSesion}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-red-700"
          >
            <FiLogOut size={18} />
            Cerrar sesión
          </button>
        </div>

      </aside>
    </>
  );
}

export default MenuLateral;